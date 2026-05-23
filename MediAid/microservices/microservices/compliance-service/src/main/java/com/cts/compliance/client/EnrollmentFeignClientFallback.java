package com.cts.compliance.client;

import com.cts.compliance.dto.EnrollmentClientResponseDTO;
import org.springframework.stereotype.Component;

/**
 * Fallback for EnrollmentFeignClient.
 * Policy rules that need enrollment data will skip gracefully
 * when enrollment-service is unavailable.
 */
@Component
public class EnrollmentFeignClientFallback implements EnrollmentFeignClient {

    @Override
    public EnrollmentClientResponseDTO getEnrollment(Long enrollmentId) {
        System.err.println("[ComplianceService] enrollment-service unavailable — "
                + "enrichment skipped for enrollmentId=" + enrollmentId
                + ". Rules will run on supplied context only.");
        return null;
    }
}
