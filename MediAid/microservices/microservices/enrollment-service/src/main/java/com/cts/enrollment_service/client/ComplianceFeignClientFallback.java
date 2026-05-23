package com.cts.enrollment_service.client;

import com.cts.enrollment_service.dto.ComplianceEvaluationResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback for ComplianceFeignClient.
 * Enrollment approval always completes — compliance evaluation is best-effort.
 * Officer can trigger manual evaluation via audit-management-service if needed.
 */
@Component
public class ComplianceFeignClientFallback implements ComplianceFeignClient {

    @Override
    public ComplianceEvaluationResponseDTO evaluate(Long entityId, String entityType, Long requestedBy) {
        System.err.println("[EnrollmentService] compliance-service unavailable — "
                + "auto-evaluation skipped for POLICY:" + entityId
                + ". Officer can trigger manually via audit-management-service.");
        return ComplianceEvaluationResponseDTO.builder()
                .result("FLAGGED")
                .notes("Compliance service unavailable at enrollment approval. Manual evaluation required.")
                .build();
    }
}
