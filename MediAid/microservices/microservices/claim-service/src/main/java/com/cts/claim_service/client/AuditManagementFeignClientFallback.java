package com.cts.claim_service.client;

import com.cts.claim_service.dto.AuditManagementLogRequest;
import org.springframework.stereotype.Component;

/**
 * Fallback for AuditManagementFeignClient.
 * Audit logging is best-effort — claim operations (submit, approve, reject)
 * always complete regardless of audit-management-service availability.
 */
@Component
public class AuditManagementFeignClientFallback implements AuditManagementFeignClient {

    @Override
    public void log(AuditManagementLogRequest request) {
        System.err.println("[ClaimService] audit-management-service unavailable — "
                + "audit log NOT written. action="
                + (request != null ? request.getAction() : "null")
                + ", resource="
                + (request != null ? request.getResource() : "null"));
    }
}
