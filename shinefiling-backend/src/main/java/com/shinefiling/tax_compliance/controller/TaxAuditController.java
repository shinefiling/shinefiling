package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.TaxAuditRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/tax-audit")
@CrossOrigin(origins = "http://localhost:5173")
public class TaxAuditController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Tax Audit Filing (44AB)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TaxAuditRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<TaxAuditRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan, requestDTO.getFormData());
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("AUDIT_INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan.toUpperCase());
            createdRequest
                    .setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : getPlanAmount(plan));
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("AUDIT_INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<TaxAuditRequest.AutomationTaskDTO> generateAutomationTasks(String plan,
            TaxAuditRequest.TaxAuditFormData formData) {
        List<TaxAuditRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "AUDIT_APPLICABILITY_CHECK", "Verify Turnover Limits (> 1Cr/50L)", "HIGH");
        addTask(tasks, "AUDITOR_ASSIGNMENT", "Assign CA for Audit", "HIGH");
        addTask(tasks, "DOCUMENT_VALIDATION", "Validate BS, P&L, Ledgers", "HIGH");
        addTask(tasks, "AUDIT_REPORT_PREP", "Prepare Form 3CA/3CB & 3CD", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "BOOKS_REVIEW", "Detailed Review of Books of Accounts", "HIGH");
            addTask(tasks, "CLAUSE_VALIDATION", "Clause-wise Validation of Form 3CD", "MEDIUM");
            addTask(tasks, "ERROR_RECTIFICATION", "Rectify Accounting Discrepancies", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "NOTICE_HANDLING", "Handle Audit-Related Notices", "MEDIUM");
            addTask(tasks, "POST_AUDIT_COMPLIANCE", "Verify ITR Linking", "LOW");
            addTask(tasks, "FUTURE_RISK_ADVISORY", "Advisory on Future Audit Risks", "LOW");
        }

        return tasks;
    }

    private void addTask(List<TaxAuditRequest.AutomationTaskDTO> tasks, String taskName, String desc, String priority) {
        TaxAuditRequest.AutomationTaskDTO t = new TaxAuditRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 4999.0;
            case "standard":
                return 9999.0;
            case "premium":
                return 14999.0;
            default:
                return 0.0;
        }
    }
}
