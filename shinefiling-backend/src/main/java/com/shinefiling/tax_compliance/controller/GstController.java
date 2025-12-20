package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.GstRegistrationRequest;
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
@RequestMapping("/api/service/gst-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class GstController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "GST Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody GstRegistrationRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Validation can be added here if needed (e.g., PAN format check)

            // Generate Automation Tasks
            List<GstRegistrationRequest.AutomationTaskDTO> tasks = generateGstAutomationTasks(plan);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan.toUpperCase());

            Double amount = requestDTO.getAmountPaid();
            if (amount == null) {
                amount = getPlanAmount(plan);
            }
            createdRequest.setAmount(amount);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

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
            return ResponseEntity.ok(serviceRequestService.getUserRequestsByService(email, SERVICE_NAME));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            return ResponseEntity.ok(serviceRequestService.getRequestsByService(SERVICE_NAME));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, payload.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- HELPER METHODS ---

    private List<GstRegistrationRequest.AutomationTaskDTO> generateGstAutomationTasks(String plan) {
        List<GstRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify PAN/Aadhaar & Address Proof", "HIGH");
        addTask(tasks, "GST_REG_01_FILING", "File GST REG-01 on Portal", "HIGH");
        addTask(tasks, "AADHAAR_AUTHENTICATION", "Coordinate Aadhaar OTP with Client", "HIGH");
        addTask(tasks, "ARN_GENERATION", "Generate ARN and Track Status", "MEDIUM");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "HSN_SAC_MAPPING", "Map Business Activities to Correct HSN/SAC Codes", "MEDIUM");
            addTask(tasks, "OFFICER_QUERY_HANDLING", "Handle First Round of Clarifications (REG-03)", "HIGH");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_LOGIN_SETUP", "Create GST Portal Login Credentials", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_LINKING", "Link Bank Account on GST Portal", "MEDIUM");
            addTask(tasks, "RETURN_FILING_GUIDANCE", "Guide on GSTR-1 & GSTR-3B for 3 Months", "LOW");
        }

        return tasks;
    }

    private void addTask(List<GstRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        GstRegistrationRequest.AutomationTaskDTO t = new GstRegistrationRequest.AutomationTaskDTO();
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



