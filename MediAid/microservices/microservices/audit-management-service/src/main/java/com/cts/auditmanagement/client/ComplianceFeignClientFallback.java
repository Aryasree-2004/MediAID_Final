package com.cts.auditmanagement.client;

import com.cts.auditmanagement.dto.ComplianceEvaluationResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback when compliance-service is unavailable.
 * Returns FLAGGED so the formal audit is never silently skipped —
 * the officer sees the flag and retries when the service recovers.
 */
@Component
public class ComplianceFeignClientFallback implements ComplianceFeignClient {

    @Override
    public ComplianceEvaluationResponseDTO evaluate(Long entityId, String entityType, Long requestedBy) {
        System.err.println("[AuditManagementService] compliance-service unavailable — "
                + "entityId=" + entityId + ", entityType=" + entityType);
        return ComplianceEvaluationResponseDTO.builder()
                .result("FLAGGED")
                .notes("Compliance service unavailable. Evaluation pending — please retry.")
                .build();
    }
}
