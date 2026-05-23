package com.cts.enrollment_service.client;

import com.cts.enrollment_service.dto.AuditManagementLogRequest;
import org.springframework.stereotype.Component;

/**
 * Fallback for AuditManagementFeignClient.
 * Audit logging is best-effort — enrollment operations always
 * complete regardless of audit-management-service availability.
 */
@Component
public class AuditManagementFeignClientFallback implements AuditManagementFeignClient {

    @Override
    public void log(AuditManagementLogRequest request) {
        System.err.println("[EnrollmentService] audit-management-service unavailable — "
                + "audit log NOT written. action="
                + (request != null ? request.getAction() : "null")
                + ", resource="
                + (request != null ? request.getResource() : "null"));
    }
}
