package com.cts.claim_service.client;

import com.cts.claim_service.dto.ComplianceEvaluationResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback for ComplianceFeignClient.
 * Claim approval always completes — compliance evaluation is best-effort.
 * If compliance-service is down, the claim stays APPROVED and compliance
 * can be triggered manually by an officer via audit-management-service.
 */
@Component
public class ComplianceFeignClientFallback implements ComplianceFeignClient {

    @Override
    public ComplianceEvaluationResponseDTO evaluate(Long entityId, String entityType, Long requestedBy) {
        System.err.println("[ClaimService] compliance-service unavailable — "
                + "auto-evaluation skipped for CLAIM:" + entityId
                + ". Officer can trigger manually via audit-management-service.");
        return ComplianceEvaluationResponseDTO.builder()
                .result("FLAGGED")
                .notes("Compliance service unavailable at claim approval. Manual evaluation required.")
                .build();
    }
}
