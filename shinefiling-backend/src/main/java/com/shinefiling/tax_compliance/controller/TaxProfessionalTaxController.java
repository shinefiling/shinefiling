package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.ProfessionalTaxRequest;
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
@RequestMapping("/api/service/tax/professional-tax")
@CrossOrigin(origins = "http://localhost:5173")
public class TaxProfessionalTaxController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Professional Tax (PT)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ProfessionalTaxRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<ProfessionalTaxRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan,
                    requestDTO.getFormData());
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

    private List<ProfessionalTaxRequest.AutomationTaskDTO> generateAutomationTasks(String plan,
            ProfessionalTaxRequest.PtFormData formData) {
        List<ProfessionalTaxRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        String state = formData.getState() != null ? formData.getState() : "General";

        // Core Process (All Plans)
        addTask(tasks, "STATE_ELIGIBILITY_CHECK", "Verify PT Applicability for " + state, "HIGH");
        addTask(tasks, "PT_REGISTRATION", "File PT Registration (EC/RC) on State Portal", "HIGH");
        addTask(tasks, "CERTIFICATE_ISSUANCE", "Generate & Upload PT Certificate", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "SLAB_MAPPING", "Map Employee Salaries to PT Slabs", "MEDIUM");
            addTask(tasks, "PT_RETURN_FILING", "File Periodic PT Return", "HIGH");
            addTask(tasks, "CHALLAN_GENERATION", "Generate Payment Challan", "HIGH");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "NOTICE_HANDLING", "Handle PT Dept Notices (if any)", "MEDIUM");
            addTask(tasks, "COMPLIANCE_CALENDAR", "Setup Auto-Reminders for Renewals", "LOW");
            addTask(tasks, "AUDIT_READY_RECORDS", "Prepare Employee PT Ledger", "LOW");
        }

        return tasks;
    }

    private void addTask(List<ProfessionalTaxRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        ProfessionalTaxRequest.AutomationTaskDTO t = new ProfessionalTaxRequest.AutomationTaskDTO();
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
                return 2499.0;
            case "premium":
                return 4999.0;
            default:
                return 0.0;
        }
    }
}
