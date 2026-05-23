package com.mediaid.payment.client;

import com.mediaid.payment.dto.AuditManagementLogRequest;
import org.springframework.stereotype.Component;

/**
 * Fallback for AuditManagementFeignClient.
 * Audit logging is best-effort — payment operations always
 * complete regardless of audit-management-service availability.
 */
@Component
public class AuditManagementFeignClientFallback implements AuditManagementFeignClient {

    @Override
    public void log(AuditManagementLogRequest request) {
        System.err.println("[PaymentService] audit-management-service unavailable — "
                + "audit log NOT written. action="
                + (request != null ? request.getAction() : "null")
                + ", resource="
                + (request != null ? request.getResource() : "null"));
    }
}
