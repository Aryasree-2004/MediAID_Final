package com.cts.compliance.client;

import com.cts.compliance.dto.ClaimClientResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback for ClaimFeignClient.
 * Returns an empty wrapper — ComplianceRecordServiceImpl null-checks .getData()
 * and falls back to running rules with whatever context was already provided.
 * Compliance evaluation is never blocked by claim-service being unavailable.
 */
@Component
public class ClaimFeignClientFallback implements ClaimFeignClient {

    @Override
    public ClaimClientResponseDTO getClaim(Long claimId) {
        System.err.println("[ComplianceService] claim-service unavailable — "
                + "enrichment skipped for claimId=" + claimId
                + ". Rules will run on supplied context only.");
        return null;
    }
}
