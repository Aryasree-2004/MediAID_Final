package com.cts.compliance.client;

import com.cts.compliance.dto.AuditManagementLogRequest;
import org.springframework.stereotype.Component;

/**
 * Fallback for AuditManagementFeignClient.
 * Compliance evaluation result is always saved even when
 * audit-management-service is unreachable.
 */
@Component
public class AuditManagementFeignClientFallback implements AuditManagementFeignClient {

    @Override
    public void log(AuditManagementLogRequest request) {
        System.err.println("[ComplianceService] audit-management-service unavailable — "
                + "audit log NOT written. action="
                + (request != null ? request.getAction() : "null")
                + ", resource="
                + (request != null ? request.getResource() : "null"));
    }
}
