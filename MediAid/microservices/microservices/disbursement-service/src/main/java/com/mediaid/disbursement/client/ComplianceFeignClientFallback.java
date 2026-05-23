package com.mediaid.disbursement.client;

import com.mediaid.disbursement.dto.ComplianceEvaluationResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback for ComplianceFeignClient.
 * Disbursement creation always completes — compliance evaluation is best-effort.
 * If compliance-service is down, disbursement stays PROCESSING and compliance
 * can be triggered manually via audit-management-service.
 */
@Component
public class ComplianceFeignClientFallback implements ComplianceFeignClient {

    @Override
    public ComplianceEvaluationResponseDTO evaluate(Long entityId, String entityType, Long requestedBy) {
        System.err.println("[DisbursementService] compliance-service unavailable — "
                + "auto-evaluation skipped for DISBURSEMENT:" + entityId
                + ". Officer can trigger manually via audit-management-service.");
        return ComplianceEvaluationResponseDTO.builder()
                .result("FLAGGED")
                .notes("Compliance service unavailable at disbursement creation. Manual evaluation required.")
                .build();
    }
}
