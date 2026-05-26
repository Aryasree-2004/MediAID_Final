package com.cts.gateway.controller;

import com.cts.gateway.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;

@RestController
public class GatewayController {

    private static final Logger log = LoggerFactory.getLogger(GatewayController.class);

    private final RestTemplate restTemplate;
    private final JwtUtils jwtUtils;

    @Value("${service.auth.url}")
    private String authServiceUrl;

    @Value("${service.user.url}")
    private String userServiceUrl;

    @Value("${service.audit.url}")
    private String auditServiceUrl;

    @Value("${service.citizen.url}")
    private String citizenServiceUrl;

    @Value("${service.scheme.url}")
    private String schemeServiceUrl;

    @Value("${service.enrollment.url}")
    private String enrollmentServiceUrl;

    @Value("${service.claim.url}")
    private String claimServiceUrl;

    @Value("${service.disbursement.url}")
    private String disbursementServiceUrl;

    @Value("${service.payment.url}")
    private String paymentServiceUrl;

    @Value("${service.audit-management.url}")
    private String auditManagementServiceUrl;

    @Value("${service.compliance.url}")
    private String complianceServiceUrl;

    public GatewayController(RestTemplate restTemplate, JwtUtils jwtUtils) {
        this.restTemplate = restTemplate;
        this.jwtUtils = jwtUtils;
    }

    /**
     * Dedicated proxy for binary file downloads.
     * Uses byte[] (not String) so binary content is never corrupted by charset conversion.
     * Handles both citizen-service (/api/documents/) and claim-service (/api/claims/documents/).
     * Spring MVC selects this over the generic @RequestMapping("/**") because it is more specific.
     */
    @GetMapping({
        "/api/documents/{fileName:.+}/download",
        "/api/claims/documents/{fileName:.+}/download"
    })
    public ResponseEntity<byte[]> proxyDownload(
            HttpServletRequest request,
            @PathVariable String fileName) {

        String path = request.getRequestURI();
        log.debug("Gateway binary download: {}", path);

        // JWT authentication — same check as the generic route method.
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Unauthorized download request for {}", path);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        if (!jwtUtils.validateJwtToken(token)) {
            log.warn("Invalid JWT for download request {}", path);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String extractedUsername = jwtUtils.getUsernameFromToken(token);
        String extractedRole    = jwtUtils.getRoleFromToken(token);
        Long   extractedUserId  = jwtUtils.getUserIdFromToken(token);

        // Route: claim documents → claim-service, everything else → citizen-service.
        String targetBase = path.startsWith("/api/claims/") ? claimServiceUrl : citizenServiceUrl;
        String targetUrl  = targetBase + path;

        HttpHeaders headers = buildForwardHeaders(request, extractedUsername, extractedRole, extractedUserId);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<byte[]> resp = restTemplate.exchange(targetUrl, HttpMethod.GET, entity, byte[].class);

            // Pass through only the headers the browser needs for a file download.
            HttpHeaders responseHeaders = new HttpHeaders();
            String ct   = resp.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE);
            String cd   = resp.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
            String cl   = resp.getHeaders().getFirst(HttpHeaders.CONTENT_LENGTH);
            if (ct  != null) responseHeaders.set(HttpHeaders.CONTENT_TYPE,         ct);
            if (cd  != null) responseHeaders.set(HttpHeaders.CONTENT_DISPOSITION,  cd);
            if (cl  != null) responseHeaders.set(HttpHeaders.CONTENT_LENGTH,        cl);

            return ResponseEntity.status(resp.getStatusCode())
                    .headers(responseHeaders)
                    .body(resp.getBody());

        } catch (HttpStatusCodeException e) {
            log.warn("Downstream returned {} for download {}", e.getStatusCode(), targetUrl);
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (ResourceAccessException e) {
            log.error("Service unreachable for download {}: {}", targetUrl, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        } catch (Exception e) {
            log.error("Unexpected download proxy error for {}", targetUrl, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Returns true for paths that bypass JWT authentication at the gateway.
     */
    private boolean isPublicPath(String path) {
        return path.startsWith("/api/auth")
                || path.startsWith("/api/audit/internal/")
                || path.startsWith("/api/audit-management/internal/")
                || path.equals("/api/compliance/evaluate")
                || path.startsWith("/swagger-ui")
                || path.startsWith("/v3/api-docs");
    }

    @RequestMapping("/**")
    public ResponseEntity<String> route(HttpServletRequest request,
                                        @RequestBody(required = false) String body) {

        String path = request.getRequestURI();
        log.debug("Gateway routing {} {}", request.getMethod(), path);

        String extractedUsername = null;
        String extractedRole = null;
        Long extractedUserId = null;

        // ── Centralised JWT authentication ───────────────────────────────────
        if (!isPublicPath(path)) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Unauthorized request to {} (missing or malformed Authorization header)", path);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"status\":\"ERROR\",\"message\":\"Authentication required\"}");
            }
            String token = authHeader.substring(7);
            if (!jwtUtils.validateJwtToken(token)) {
                log.warn("Invalid or expired JWT for path {}", path);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("{\"status\":\"ERROR\",\"message\":\"Invalid or expired token\"}");
            }
            extractedUsername = jwtUtils.getUsernameFromToken(token);
            extractedRole = jwtUtils.getRoleFromToken(token);
            extractedUserId = jwtUtils.getUserIdFromToken(token);
            log.debug("Authenticated user={} role={} for {}", extractedUsername, extractedRole, path);
        }

        if (request.getContentType() != null && request.getContentType().contains("multipart/form-data")) {
            String targetBase;
            if (path.startsWith("/api/citizens") || path.startsWith("/api/documents")) {
                targetBase = citizenServiceUrl;
            } else if (path.startsWith("/api/claims")) {
                targetBase = claimServiceUrl;
            } else {
                return ResponseEntity.badRequest().body("{\"status\":\"ERROR\",\"message\":\"No multipart route found\"}");
            }

            String targetUrl = targetBase + path;
            String queryString = request.getQueryString();
            if (queryString != null) targetUrl += "?" + queryString;

            HttpHeaders headers = buildForwardHeaders(request, extractedUsername, extractedRole, extractedUserId);
            headers.remove(HttpHeaders.CONTENT_TYPE);

            try {
                MultiValueMap<String, Object> multiPartBody = new LinkedMultiValueMap<>();
                for (Part part : request.getParts()) {
                    if (part.getContentType() != null) {
                        multiPartBody.add(part.getName(), new ByteArrayResource(part.getInputStream().readAllBytes()) {
                            @Override
                            public String getFilename() {
                                return part.getSubmittedFileName();
                            }
                        });
                    } else {
                        multiPartBody.add(part.getName(), new String(part.getInputStream().readAllBytes()));
                    }
                }
                HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(multiPartBody, headers);
                return restTemplate.exchange(targetUrl, HttpMethod.POST, entity, String.class);
            } catch (HttpStatusCodeException e) {
                log.warn("Downstream returned {} for multipart upload to {}", e.getStatusCode(), targetUrl);
                return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
            } catch (ResourceAccessException e) {
                log.error("Downstream service unreachable for {}: {}", targetUrl, e.getMessage());
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body("{\"status\":\"ERROR\",\"message\":\"Service temporarily unavailable. Please try again.\"}");
            } catch (Exception e) {
                log.error("Multipart proxy error for {}", targetUrl, e);
                return ResponseEntity.status(500).body("{\"status\":\"ERROR\",\"message\":\"Internal proxy error\"}");
            }
        }

        String targetBase;

        if (path.startsWith("/api/auth")) {
            targetBase = authServiceUrl;
        } else if (path.startsWith("/api/users")) {
            targetBase = userServiceUrl;
        } else if (path.startsWith("/api/audit-management")) {
            targetBase = auditManagementServiceUrl;
        } else if (path.startsWith("/api/audit") || path.startsWith("/api/audits")) {
            targetBase = auditServiceUrl;
        } else if (path.startsWith("/api/citizens") || path.startsWith("/api/documents")) {
            targetBase = citizenServiceUrl;
        } else if (path.startsWith("/api/schemes")) {
            targetBase = schemeServiceUrl;
        } else if (path.startsWith("/api/enrollments")) {
            targetBase = enrollmentServiceUrl;
        } else if (path.startsWith("/api/claims")) {
            targetBase = claimServiceUrl;
        } else if (path.startsWith("/api/disbursement")) {
            targetBase = disbursementServiceUrl;
        } else if (path.startsWith("/api/payment")) {
            targetBase = paymentServiceUrl;
        } else if (path.startsWith("/api/compliance")) {
            targetBase = complianceServiceUrl;
        } else {
            log.warn("No route found for {}", path);
            return ResponseEntity.badRequest().body(
                    "{\"status\":\"ERROR\",\"message\":\"No route found for path: " + path + "\"}"
            );
        }

        String targetUrl = targetBase + path;
        String queryString = request.getQueryString();
        if (queryString != null) {
            targetUrl += "?" + queryString;
        }

        HttpHeaders headers = buildForwardHeaders(request, extractedUsername, extractedRole, extractedUserId);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            return restTemplate.exchange(targetUrl, method, entity, String.class);
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            log.error("Downstream service unreachable for {}: {}", targetUrl, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("{\"status\":\"ERROR\",\"message\":\"Service temporarily unavailable. Please try again.\"}");
        } catch (Exception e) {
            log.error("Unexpected proxy error for {}", targetUrl, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"status\":\"ERROR\",\"message\":\"Internal gateway error\"}");
        }
    }

    private HttpHeaders buildForwardHeaders(HttpServletRequest request,
                                            String username,
                                            String role,
                                            Long userId) {
        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("content-length")
                    && !headerName.equalsIgnoreCase("host")) {
                headers.set(headerName, request.getHeader(headerName));
            }
        }
        if (username != null) {
            headers.set("X-Username", username);
        }
        if (role != null) {
            headers.set("X-User-Role", role);
        }
        if (userId != null) {
            headers.set("X-User-Id", String.valueOf(userId));
        }
        return headers;
    }
}
