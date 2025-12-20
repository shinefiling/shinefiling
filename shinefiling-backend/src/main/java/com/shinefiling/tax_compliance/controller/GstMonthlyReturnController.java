package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.GstMonthlyReturnRequest;
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
@RequestMapping("/api/service/gst-monthly-return")
@CrossOrigin(origins = "http://localhost:5173")
public class GstMonthlyReturnController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "GST Monthly Return";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody GstMonthlyReturnRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<GstMonthlyReturnRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan);
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

    private List<GstMonthlyReturnRequest.AutomationTaskDTO> generateAutomationTasks(String plan) {
        List<GstMonthlyReturnRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "DATA_VERIFICATION", "Verify Sales/Purchase Data Formats", "HIGH");
        addTask(tasks, "GSTR1_FILING", "File GSTR-1 (Outward Supplies)", "HIGH");
        addTask(tasks, "GSTR3B_PREPARATION", "Calculate Tax Liability & ITC", "HIGH");
        addTask(tasks, "GSTR3B_FILING", "File GSTR-3B after confirmation", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "ITC_RECONCILIATION", "Reconcile Purchase Data with GSTR-2B", "MEDIUM");
            addTask(tasks, "INVOICE_VALIDATION", "Check for Duplicate/Invalid Invoices", "MEDIUM");
            addTask(tasks, "OFFICER_QUERY_HANDLING", "Handle 1st Round of Queries if any", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "COMPLIANCE_DASHBOARD_UPDATE", "Update Monthly Compliance Metrics", "LOW");
            addTask(tasks, "INTEREST_OPTIMIZATION", "Optimize Interest & Late Fees", "MEDIUM");
            addTask(tasks, "AUDIT_REPORT_GENERATION", "Generate Audit-Ready Monthly Report", "LOW");
        }

        return tasks;
    }

    private void addTask(List<GstMonthlyReturnRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        GstMonthlyReturnRequest.AutomationTaskDTO t = new GstMonthlyReturnRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 499.0;
            case "standard":
                return 1499.0;
            case "premium":
                return 3499.0;
            default:
                return 0.0;
        }
    }
}



