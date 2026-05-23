package com.cts.user.client;

import org.springframework.stereotype.Component;

/**
 * Wrapper around AuditFeignClient.
 * Provides a simple log() method used throughout user-service.
 * Uses Feign + Eureka — no hardcoded URLs, automatic load balancing.
 */
@Component
public class AuditServiceClient {

    private final AuditFeignClient auditFeignClient;

    public AuditServiceClient(AuditFeignClient auditFeignClient) {
        this.auditFeignClient = auditFeignClient;
    }

    public void log(Long userId, String action, String resource) {
        try {
            AuditLogRequest request = new AuditLogRequest(userId, action, resource);
            auditFeignClient.log(request);
        } catch (Exception e) {
            System.err.println("[User] Audit logging failed (non-critical): " + e.getMessage());
        }
    }
}
