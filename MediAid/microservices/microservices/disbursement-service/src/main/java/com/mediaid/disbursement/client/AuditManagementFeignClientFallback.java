package com.mediaid.disbursement.client;

import com.mediaid.disbursement.dto.AuditManagementLogRequest;
import org.springframework.stereotype.Component;

/**
 * Fallback for AuditManagementFeignClient.
 * Audit logging is best-effort — disbursement operations always
 * complete regardless of audit-management-service availability.
 */
@Component
public class AuditManagementFeignClientFallback implements AuditManagementFeignClient {

    @Override
    public void log(AuditManagementLogRequest request) {
        System.err.println("[DisbursementService] audit-management-service unavailable — "
                + "audit log NOT written. action="
                + (request != null ? request.getAction() : "null")
                + ", resource="
                + (request != null ? request.getResource() : "null"));
    }
}
