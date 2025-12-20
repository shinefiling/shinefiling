package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.GstAnnualReturnRequest;
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
@RequestMapping("/api/service/gst-annual-return")
@CrossOrigin(origins = "http://localhost:5173")
public class GstAnnualReturnController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "GST Annual Return (GSTR-9)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody GstAnnualReturnRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<GstAnnualReturnRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan);
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

    private List<GstAnnualReturnRequest.AutomationTaskDTO> generateAutomationTasks(String plan) {
        List<GstAnnualReturnRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "DATA_COMPILATION", "Compile GSTR-1 & GSTR-3B Data", "HIGH");
        addTask(tasks, "ANNUAL_RECONCILIATION", "Reconcile Annual Totals", "HIGH");
        addTask(tasks, "GSTR9_PREPARATION", "Prepare GSTR-9 Draft", "HIGH");
        addTask(tasks, "GSTR9_FILING", "File GSTR-9 on Portal", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "ITC_REVERSAL_CHECK", "Analyze ITC Reversals & Mismatches", "MEDIUM");
            addTask(tasks, "NOTICE_RISK_REVIEW", "Identify & Flag High Risk Differences", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "QUERY_HANDLING", "Assist with Dept Queries (if any)", "MEDIUM");
            addTask(tasks, "AUDIT_READY_REPORT", "Generate Comprehensive Annual Audit Pack", "LOW");
            addTask(tasks, "FUTURE_COMPLIANCE_GUIDE", "Roadmap for Next Financial Year", "LOW");
        }

        return tasks;
    }

    private void addTask(List<GstAnnualReturnRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        GstAnnualReturnRequest.AutomationTaskDTO t = new GstAnnualReturnRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 2999.0;
            case "standard":
                return 6999.0;
            case "premium":
                return 12999.0;
            default:
                return 0.0;
        }
    }
}



