package com.cts.compliance.serviceImpl;

import com.cts.compliance.client.AuditManagementFeignClient;
import com.cts.compliance.client.ClaimFeignClient;
import com.cts.compliance.client.DisbursementFeignClient;
import com.cts.compliance.client.EnrollmentFeignClient;
import com.cts.compliance.dto.*;
import com.cts.compliance.enums.ComplianceResult;
import com.cts.compliance.enums.EntityType;
import com.cts.compliance.exception.BadRequestException;
import com.cts.compliance.exception.ResourceNotFoundException;
import com.cts.compliance.mapper.ComplianceMapper;
import com.cts.compliance.model.ComplianceRecord;
import com.cts.compliance.repository.ComplianceRecordRepository;
import com.cts.compliance.rules.ComplianceRuleEngine;
import com.cts.compliance.service.ComplianceRecordService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplianceRecordServiceImpl implements ComplianceRecordService {

    private final ComplianceRecordRepository repository;
    private final ComplianceRuleEngine ruleEngine;
    private final ComplianceMapper mapper;
    private final AuditManagementFeignClient auditManagementFeignClient;

    // ── New: data-enrichment Feign clients (Requirements 3, 4, 5) ────────────
    private final ClaimFeignClient claimFeignClient;
    private final DisbursementFeignClient disbursementFeignClient;
    private final EnrollmentFeignClient enrollmentFeignClient;

    public ComplianceRecordServiceImpl(
            ComplianceRecordRepository repository,
            ComplianceRuleEngine ruleEngine,
            ComplianceMapper mapper,
            AuditManagementFeignClient auditManagementFeignClient,
            ClaimFeignClient claimFeignClient,
            DisbursementFeignClient disbursementFeignClient,
            EnrollmentFeignClient enrollmentFeignClient) {
        this.repository                 = repository;
        this.ruleEngine                 = ruleEngine;
        this.mapper                     = mapper;
        this.auditManagementFeignClient = auditManagementFeignClient;
        this.claimFeignClient           = claimFeignClient;
        this.disbursementFeignClient    = disbursementFeignClient;
        this.enrollmentFeignClient      = enrollmentFeignClient;
    }

    // ── Simple evaluate ───────────────────────────────────────────────────────
    // Called by audit-management-service Feign with only entityId + entityType.
    // We enrich the request by fetching real data from the owning service
    // before passing to the rule engine.

    @Override
    @Transactional
    public ComplianceEvaluationResponseDTO evaluateSimple(
            Long entityId, String entityType, Long requestedBy) {

        EntityType type = parseEntityType(entityType);
        ComplianceEvaluationRequestDTO enriched = enrich(entityId, type, requestedBy);
        return runAndPersist(enriched);
    }

    // ── Full evaluate ─────────────────────────────────────────────────────────
    // Called directly by officers/gateway with complete context supplied —
    // no enrichment needed, rule engine uses what the caller provides.

    @Override
    @Transactional
    public ComplianceEvaluationResponseDTO evaluateFull(ComplianceEvaluationRequestDTO dto) {
        if (dto == null) throw new BadRequestException("Evaluation request cannot be null");
        return runAndPersist(dto);
    }

    // ── Manual check ──────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ComplianceRecordResponseDTO manualCheck(ComplianceRecordRequestDTO dto) {
        ComplianceEvaluationRequestDTO req = ComplianceEvaluationRequestDTO.builder()
                .entityId(dto.getEntityId())
                .entityType(dto.getEntityType())
                .requestedBy(dto.getRequestedBy())
                .build();
        ComplianceRuleEngine.RuleResult ruleResult = ruleEngine.evaluate(req);
        ComplianceRecord saved = saveRecord(
                dto.getEntityId(), dto.getEntityType(), ruleResult, dto.getRequestedBy());
        writeAuditLog(dto.getRequestedBy(), "COMPLIANCE_MANUAL_CHECK",
                dto.getEntityType().name() + ":" + dto.getEntityId(),
                "Manual check, result=" + ruleResult.result());
        return mapper.toDto(saved);
    }

    // ── Queries ───────────────────────────────────────────────────────────────

    @Override
    public ComplianceRecordResponseDTO getById(Long complianceId) {
        return mapper.toDto(repository.findById(complianceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "ComplianceRecord not found: " + complianceId)));
    }

    @Override
    public List<ComplianceRecordResponseDTO> getAll() {
        return repository.findAll().stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ComplianceRecordResponseDTO> getByEntityId(Long entityId) {
        return repository.findByEntityId(entityId).stream()
                .map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ComplianceRecordResponseDTO> getByEntityType(String entityType) {
        return repository.findByEntityType(parseEntityType(entityType)).stream()
                .map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ComplianceRecordResponseDTO> getViolations() {
        return repository.findByResult(ComplianceResult.FAIL).stream()
                .map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public List<ComplianceRecordResponseDTO> getFlagged() {
        return repository.findByResult(ComplianceResult.FLAGGED).stream()
                .map(mapper::toDto).collect(Collectors.toList());
    }

    // ── Enrichment ────────────────────────────────────────────────────────────
    // Fetches real data from the owning service and builds a fully populated
    // request for the rule engine. If the owning service is unavailable,
    // the fallback returns null and we run rules on minimal context —
    // rules that need the missing field skip gracefully (not a hard failure).

    private ComplianceEvaluationRequestDTO enrich(
            Long entityId, EntityType type, Long requestedBy) {

        ComplianceEvaluationRequestDTO.ComplianceEvaluationRequestDTOBuilder builder =
                ComplianceEvaluationRequestDTO.builder()
                        .entityId(entityId)
                        .entityType(type)
                        .requestedBy(requestedBy);

        switch (type) {
            case CLAIM -> enrichClaim(entityId, builder);
            case DISBURSEMENT -> enrichDisbursement(entityId, builder);
            case POLICY -> enrichPolicy(entityId, builder);
        }

        return builder.build();
    }

    /**
     * Requirement 3: compliance → claim-service
     * Fetches claimAmount and policy expiry for CLAIM rules C-1, C-2, C-3, C-4.
     */
    private void enrichClaim(Long claimId,
            ComplianceEvaluationRequestDTO.ComplianceEvaluationRequestDTOBuilder builder) {
        try {
            ClaimClientResponseDTO response = claimFeignClient.getClaim(claimId);
            if (response != null && response.getData() != null) {
                ClaimClientResponseDTO.ClaimData data = response.getData();
                builder.amount(data.getClaimAmount());
                // claimType not yet on Claim entity — will be populated when team adds it
                // builder.claimType(data.getClaimType());
            }
        } catch (Exception ex) {
            System.err.println("[ComplianceService] Failed to enrich CLAIM:" + claimId
                    + " — " + ex.getMessage() + ". Rules run on minimal context.");
        }
    }

    /**
     * Requirement 4: compliance → disbursement-service
     * Fetches amount and linkedClaimId for DISBURSEMENT rules D-1, D-2, D-3.
     */
    private void enrichDisbursement(Long disbursementId,
            ComplianceEvaluationRequestDTO.ComplianceEvaluationRequestDTOBuilder builder) {
        try {
            DisbursementClientResponseDTO response =
                    disbursementFeignClient.getDisbursement(disbursementId);
            if (response != null && response.getData() != null) {
                DisbursementClientResponseDTO.DisbursementData data = response.getData();
                builder.amount(data.getAmount() != null
                        ? data.getAmount().doubleValue() : null);
                builder.linkedClaimId(data.getClaimId());
            }
        } catch (Exception ex) {
            System.err.println("[ComplianceService] Failed to enrich DISBURSEMENT:"
                    + disbursementId + " — " + ex.getMessage()
                    + ". Rules run on minimal context.");
        }
    }

    /**
     * Requirement 5: compliance → enrollment-service
     * Fetches expiryDate, enrollmentDate, and citizenId for POLICY rules P-1, P-2, P-3.
     * entityId here is the enrollmentId (policy is tracked via enrollment in this system).
     */
    private void enrichPolicy(Long enrollmentId,
            ComplianceEvaluationRequestDTO.ComplianceEvaluationRequestDTOBuilder builder) {
        try {
            EnrollmentClientResponseDTO response =
                    enrollmentFeignClient.getEnrollment(enrollmentId);
            if (response != null && response.getData() != null) {
                EnrollmentClientResponseDTO.EnrollmentData data = response.getData();
                if (data.getExpiryDate() != null) {
                    builder.policyExpiryDate(LocalDate.parse(data.getExpiryDate()));
                }
                if (data.getEnrollmentDate() != null) {
                    builder.policyEnrollmentDate(LocalDate.parse(data.getEnrollmentDate()));
                }
                builder.citizenId(data.getCitizenId());
            }
        } catch (Exception ex) {
            System.err.println("[ComplianceService] Failed to enrich POLICY (enrollment):"
                    + enrollmentId + " — " + ex.getMessage()
                    + ". Rules run on minimal context.");
        }
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private ComplianceEvaluationResponseDTO runAndPersist(
            ComplianceEvaluationRequestDTO req) {
        ComplianceRuleEngine.RuleResult ruleResult = ruleEngine.evaluate(req);
        ComplianceRecord saved = saveRecord(
                req.getEntityId(), req.getEntityType(), ruleResult, req.getRequestedBy());
        writeAuditLog(req.getRequestedBy(), "COMPLIANCE_EVALUATED",
                req.getEntityType().name() + ":" + req.getEntityId(),
                "Result=" + ruleResult.result());
        return ComplianceEvaluationResponseDTO.builder()
                .complianceRecordId(saved.getComplianceId())
                .result(ruleResult.result().name())
                .notes(ruleResult.notes() != null ? ruleResult.notes() : "")
                .build();
    }

    private ComplianceRecord saveRecord(Long entityId, EntityType entityType,
            ComplianceRuleEngine.RuleResult ruleResult, Long requestedBy) {
        ComplianceRecord record = ComplianceRecord.builder()
                .entityId(entityId)
                .entityType(entityType)
                .result(ruleResult.result())
                .notes(ruleResult.notes() != null ? ruleResult.notes() : "")
                .requestedBy(requestedBy)
                .build();
        return repository.save(record);
    }

    private void writeAuditLog(Long userId, String action, String resource, String details) {
        try {
            auditManagementFeignClient.log(AuditManagementLogRequest.builder()
                    .userId(userId)
                    .action(action)
                    .resource(resource)
                    .details(details)
                    .timestamp(LocalDateTime.now())
                    .build());
        } catch (Exception ex) {
            System.err.println("[ComplianceService] Error writing to audit-management-service: "
                    + ex.getMessage());
        }
    }

    private EntityType parseEntityType(String entityType) {
        try {
            return EntityType.valueOf(entityType.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(
                    "Invalid entityType '" + entityType
                            + "'. Allowed: CLAIM, POLICY, DISBURSEMENT");
        }
    }
}
