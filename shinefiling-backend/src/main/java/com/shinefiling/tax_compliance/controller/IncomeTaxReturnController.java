package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.IncomeTaxReturnRequest;
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
@RequestMapping("/api/service/income-tax-return")
@CrossOrigin(origins = "http://localhost:5173")
public class IncomeTaxReturnController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Income Tax Return (ITR)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody IncomeTaxReturnRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<IncomeTaxReturnRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan,
                    requestDTO.getFormData().getItrFormType());
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

    private List<IncomeTaxReturnRequest.AutomationTaskDTO> generateAutomationTasks(String plan, String itrType) {
        List<IncomeTaxReturnRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "DATA_VERIFICATION", "Verify Form 16 vs AIS/TIS", "HIGH");
        addTask(tasks, "ITR_PREPARATION", "Compute Income & Prepare ITR " + (itrType != null ? itrType : "Form"),
                "HIGH");
        addTask(tasks, "ITR_FILING", "File Return on e-filing portal", "HIGH");
        addTask(tasks, "E_VERIFICATION_TRACKING", "Track Aadhaar/NetBanking Verification", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "DEDUCTION_OPTIMIZATION", "Optimize 80C, 80D, etc.", "MEDIUM");
            if (itrType != null && (itrType.equals("ITR-2") || itrType.equals("ITR-3"))) {
                addTask(tasks, "CAPITAL_GAINS_COMPUTATION", "Compute Long/Short Term Capital Gains", "HIGH");
            }
            addTask(tasks, "NOTICE_REVIEW", "Review any existing department notices", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "AUDIT_READY_COMPUTATION", "Prepare Detailed Computation Sheet", "LOW");
            addTask(tasks, "REFUND_TRACKING", "Track Refund Status & Follow-up", "MEDIUM");
            addTask(tasks, "FUTURE_TAX_PLANNING", "Advisory for next Financial Year", "LOW");
        }

        return tasks;
    }

    private void addTask(List<IncomeTaxReturnRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        IncomeTaxReturnRequest.AutomationTaskDTO t = new IncomeTaxReturnRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 999.0;
            case "standard":
                return 2999.0;
            case "premium":
                return 6999.0;
            default:
                return 0.0;
        }
    }
}



