package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.PartnershipFirmRegistrationRequest;
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
@RequestMapping("/api/service/partnership-firm")
@CrossOrigin(origins = "http://localhost:5173")
public class PartnershipFirmController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Partnership Firm Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PartnershipFirmRegistrationRequest requestDTO) {
        try {
            // 1. Extract Details
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // 2. Validate Partnership-Specific Rules
            // Rule: Min 2 Partners
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getPartners() != null) {
                if (requestDTO.getFormData().getPartners().size() < 2) {
                    return ResponseEntity.badRequest().body(
                            Map.of("message", "Minimum 2 Partners are required for Partnership Firm Registration."));
                }
            }

            // 3. Generate Plan-Based Automation Tasks
            List<PartnershipFirmRegistrationRequest.AutomationTaskDTO> tasks = generatePartnershipAutomationTasks(plan);
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

            if (requestDTO.getAmountPaid() != null) {
                createdRequest.setAmount(requestDTO.getAmountPaid());
            } else {
                createdRequest.setAmount(getPlanAmount(plan));
            }

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

    private List<PartnershipFirmRegistrationRequest.AutomationTaskDTO> generatePartnershipAutomationTasks(String plan) {
        List<PartnershipFirmRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // ALL PLANS (Core Process)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify Partner KYC & Office Proof", "HIGH");
        addTask(tasks, "PARTNERSHIP_DEED_DRAFTING", "Draft Partnership Deed (Clauses, Capital, Ratio)", "HIGH");
        addTask(tasks, "PAN_APPLICATION", "Apply for Firm PAN Card", "MEDIUM");
        addTask(tasks, "BUSINESS_NAME_SEARCH", "Verify Business Name Availability", "MEDIUM");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "ROF_REGISTRATION", "Submit Form 1 to Registrar of Firms", "HIGH");
            addTask(tasks, "CERTIFIED_DEED", "Obtain Certified Copy of Partnership Deed", "MEDIUM");
            addTask(tasks, "TAN_APPLICATION", "Apply for Firm TAN", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_SUPPORT", "Assist in Bank Account Opening", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_REGISTRATION", "File GST Registration", "HIGH");
            addTask(tasks, "MSME_REGISTRATION", "File Udyam (MSME) Registration", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_END_TO_END", "End-to-End Bank Account Support", "HIGH");
            addTask(tasks, "FIRST_RESOLUTION", "Draft First Partnership Resolution", "LOW");
            addTask(tasks, "COMPLIANCE_GUIDANCE", "Setup 1-Year Compliance Calendar", "LOW");
        }

        return tasks;
    }

    private void addTask(List<PartnershipFirmRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        PartnershipFirmRegistrationRequest.AutomationTaskDTO t = new PartnershipFirmRegistrationRequest.AutomationTaskDTO();
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
                return 5999.0;
            case "premium":
                return 8999.0;
            default:
                return 0.0;
        }
    }
}

