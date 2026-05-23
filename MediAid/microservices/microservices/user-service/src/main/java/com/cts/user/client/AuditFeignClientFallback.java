package com.cts.user.client;

import org.springframework.stereotype.Component;

/**
 * Fallback for AuditFeignClient.
 * Called automatically when audit-service is down or times out.
 * User operations continue normally — audit logging is non-critical.
 */
@Component
public class AuditFeignClientFallback implements AuditFeignClient {

    @Override
    public void log(AuditLogRequest request) {
        System.err.println("[User] Audit logging failed (audit-service unavailable) - action: "
                + request.getAction() + " for userId: " + request.getUserId());
    }
}
