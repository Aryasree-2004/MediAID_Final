package com.cts.compliance.client;

import com.cts.compliance.dto.DisbursementClientResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback for DisbursementFeignClient.
 * Compliance evaluation continues with whatever context was supplied —
 * rules that need disbursement data will skip gracefully.
 */
@Component
public class DisbursementFeignClientFallback implements DisbursementFeignClient {

    @Override
    public DisbursementClientResponseDTO getDisbursement(Long disbursementId) {
        System.err.println("[ComplianceService] disbursement-service unavailable — "
                + "enrichment skipped for disbursementId=" + disbursementId
                + ". Rules will run on supplied context only.");
        return null;
    }
}
