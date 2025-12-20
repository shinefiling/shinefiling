package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.TdsReturnRequest;
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
@RequestMapping("/api/service/tds-return")
@CrossOrigin(origins = "http://localhost:5173")
public class TdsReturnController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "TDS Return Filing";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TdsReturnRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<TdsReturnRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan,
                    requestDTO.getFormData().getTdsFormType());
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

    private List<TdsReturnRequest.AutomationTaskDTO> generateAutomationTasks(String plan, String formType) {
        List<TdsReturnRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "TAN_VERIFICATION", "Verify TAN & Deductor Details", "HIGH");
        addTask(tasks, "CHALLAN_MAPPING", "Map Challans to Deductees", "HIGH");
        addTask(tasks, "TDS_FILE_PREPARATION", "Prepare FVU File for " + (formType != null ? formType : "Form"),
                "HIGH");
        addTask(tasks, "TDS_FILING", "Upload Return on TRACES/IT Portal", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "PAN_VALIDATION", "Bulk PAN Verification (FVU)", "MEDIUM");
            if (formType != null && formType.equals("24Q")) {
                addTask(tasks, "FORM_16_GENERATION", "Generate Form 16 Part A & B", "HIGH");
            } else if (formType != null && formType.equals("26Q")) {
                addTask(tasks, "FORM_16A_GENERATION", "Generate Form 16A", "HIGH");
            }
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "COMPLIANCE_DASHBOARD", "Update TDS Compliance History", "LOW");
            addTask(tasks, "LATE_FEE_OPTIMIZATION", "Optimize Interest/Late Fees logic", "MEDIUM");
            addTask(tasks, "NOTICE_HANDLING", "Prepare Reply for Defaults (if any)", "MEDIUM");
        }

        return tasks;
    }

    private void addTask(List<TdsReturnRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        TdsReturnRequest.AutomationTaskDTO t = new TdsReturnRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 1499.0;
            case "standard":
                return 3499.0;
            case "premium":
                return 6999.0;
            default:
                return 0.0;
        }
    }
}



