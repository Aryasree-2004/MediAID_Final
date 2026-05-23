package com.cts.gateway.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Enumeration;

@RestController
public class GatewayController {

    private final RestTemplate restTemplate;

    // ── Existing service URLs (unchanged) ─────────────────────────────────────
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

    // ── New service URLs ──────────────────────────────────────────────────────
    @Value("${service.audit-management.url}")
    private String auditManagementServiceUrl;

    @Value("${service.compliance.url}")
    private String complianceServiceUrl;

    public GatewayController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @RequestMapping("/**")
    public ResponseEntity<String> route(HttpServletRequest request,
                                        @RequestBody(required = false) String body) {

        String path = request.getRequestURI();

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

            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                if (!headerName.equalsIgnoreCase("content-length") &&
                        !headerName.equalsIgnoreCase("host")) {
                    headers.set(headerName, request.getHeader(headerName));
                }
            }

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
            } catch (Exception e) {
                return ResponseEntity.status(500).body("{\"status\":\"ERROR\",\"message\":\"" + e.getMessage() + "\"}");
            }
        }

        String targetBase;

        if (path.startsWith("/api/auth")) {
            targetBase = authServiceUrl;
        } else if (path.startsWith("/api/users")) {
            targetBase = userServiceUrl;
        } else if (path.startsWith("/api/audit-management")) {
            // NOTE: this branch MUST come before /api/audit to avoid prefix collision
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
            return ResponseEntity.badRequest().body(
                    "{\"status\":\"ERROR\",\"message\":\"No route found for path: " + path + "\"}"
            );
        }

        String targetUrl = targetBase + path;
        String queryString = request.getQueryString();
        if (queryString != null) {
            targetUrl += "?" + queryString;
        }

        HttpHeaders headers = new HttpHeaders();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.set(headerName, request.getHeader(headerName));
        }

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            return restTemplate.exchange(targetUrl, method, entity, String.class);
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());
        }
    }
}
