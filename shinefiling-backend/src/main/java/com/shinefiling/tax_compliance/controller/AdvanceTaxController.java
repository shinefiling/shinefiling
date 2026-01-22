package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.AdvanceTaxRequest;
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
@RequestMapping("/api/service/advance-tax")
@CrossOrigin(origins = "http://localhost:5173")
public class AdvanceTaxController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Advance Tax Filing";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody AdvanceTaxRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<AdvanceTaxRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan, requestDTO.getFormData());
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan.toUpperCase());
            createdRequest
                    .setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : getPlanAmount(plan));
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<AdvanceTaxRequest.AutomationTaskDTO> generateAutomationTasks(String plan,
            AdvanceTaxRequest.AdvanceTaxFormData formData) {
        List<AdvanceTaxRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        String installment = formData.getInstallment() != null ? formData.getInstallment() : "General";

        // Core Process (All Plans)
        addTask(tasks, "INCOME_ESTIMATION", "Review Income Projections for FY", "HIGH");
        addTask(tasks, "TAX_CALCULATION", "Compute Advance Tax Liability for " + installment, "HIGH");
        addTask(tasks, "CHALLAN_GENERATION", "Generate ITNS-280 Challan", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "INTEREST_OPTIMIZATION", "Check 234B/234C Applicability", "MEDIUM");
            addTask(tasks, "INSTALLMENT_PLANNING", "Schedule Next Due Dates", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "QUARTERLY_REVIEW", "Review Annual Income Changes", "LOW");
            addTask(tasks, "AUDIT_READY_COMPUTATION", "Prepare Detailed Working Papers", "LOW");
            addTask(tasks, "FUTURE_TAX_MAP", "Next FY Tax Strategy", "LOW");
        }

        return tasks;
    }

    private void addTask(List<AdvanceTaxRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        AdvanceTaxRequest.AutomationTaskDTO t = new AdvanceTaxRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 0.0;
            case "standard":
                return 499.0;
            case "premium":
                return 1499.0;
            default:
                return 0.0;
        }
    }
}
