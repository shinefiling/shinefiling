package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.SoleProprietorshipRegistrationRequest;
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
@RequestMapping("/api/service/sole-proprietorship")
@CrossOrigin(origins = "http://localhost:5173")
public class SoleProprietorshipController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Sole Proprietorship Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody SoleProprietorshipRegistrationRequest requestDTO) {
        try {
            // 1. Extract Details
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // 2. Validate
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getProprietor() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Proprietor details are required."));
            }

            // 3. Generate Plan-Based Automation Tasks
            List<SoleProprietorshipRegistrationRequest.AutomationTaskDTO> tasks = generateProprietorshipAutomationTasks(
                    plan);
            requestDTO.setAutomationQueue(tasks);

            // 4. Set Status if not already
            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");
            }

            // 5. Serialize to JSON for Storage
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);

            // 6. Create Service Request
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // 7. Update Plan & Amount
            createdRequest.setPlan(plan.toUpperCase());

            Double amount = requestDTO.getAmountPaid();
            if (amount == null) {
                amount = getPlanAmount(plan);
            }
            createdRequest.setAmount(amount);

            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

            // Save updates
            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        try {
            List<ServiceRequest> requests = serviceRequestService.getUserRequestsByService(email, SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<ServiceRequest> requests = serviceRequestService.getRequestsByService(SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- HELPER METHODS ---

    private List<SoleProprietorshipRegistrationRequest.AutomationTaskDTO> generateProprietorshipAutomationTasks(
            String plan) {
        List<SoleProprietorshipRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // ALL PLANS (Core Process)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify Proprietor KYC & Business Address Proof", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "Confirm Business Name Usage", "MEDIUM");
        addTask(tasks, "BASIC_COMPLIANCE", "Generate Basic Compliance Summary", "MEDIUM");
        addTask(tasks, "BANK_GUIDANCE", "Provide Bank Account Opening Guidance", "LOW");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_REGISTRATION", "File GST Registration", "HIGH");
            addTask(tasks, "SHOP_ESTABLISHMENT", "Apply for Shop & Establishment Registration", "MEDIUM");
            addTask(tasks, "MSME_REGISTRATION", "File Udyam (MSME) Registration", "MEDIUM");
            addTask(tasks, "BANK_SUPPORT", "Assist in Bank Account Opening", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "PROFESSIONAL_TAX", "Apply for Professional Tax Registration", "MEDIUM");
            addTask(tasks, "CURRENT_ACCOUNT_SUPPORT", "End-to-End Current Account Opening Support", "HIGH");
            addTask(tasks, "INVOICE_FORMAT", "Provide Invoice & Letterhead Templates", "LOW");
            addTask(tasks, "COMPLIANCE_GUIDANCE_1Y", "Setup 1-Year Compliance Reminders (GST, ITR)", "LOW");
        }

        return tasks;
    }

    private void addTask(List<SoleProprietorshipRegistrationRequest.AutomationTaskDTO> tasks, String taskName,
            String desc,
            String priority) {
        SoleProprietorshipRegistrationRequest.AutomationTaskDTO t = new SoleProprietorshipRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 1999.0;
            case "standard":
                return 4999.0;
            case "premium":
                return 7999.0;
            default:
                return 0.0;
        }
    }
}

