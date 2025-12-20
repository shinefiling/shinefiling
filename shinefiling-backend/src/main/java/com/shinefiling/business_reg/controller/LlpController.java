package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.LlpRegistrationRequest;
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
@RequestMapping("/api/service/llp")
@CrossOrigin(origins = "http://localhost:5173")
public class LlpController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Limited Liability Partnership (LLP)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody LlpRegistrationRequest requestDTO) {
        try {
            // 1. Extract Details
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // 2. Validate LLP-Specific Rules
            // Rule: Min 2 Partners
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getPartners() != null) {
                if (requestDTO.getFormData().getPartners().size() < 2) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Minimum 2 Partners are required for LLP Registration."));
                }

                // Rule: Min 2 Designated Partners
                long designatedCount = requestDTO.getFormData().getPartners().stream()
                        .filter(p -> Boolean.TRUE.equals(p.getIsDesignatedPartner()))
                        .count();
                if (designatedCount < 2) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Minimum 2 Designated Partners are required."));
                }
            }

            // 3. Generate Plan-Based Automation Tasks
            List<LlpRegistrationRequest.AutomationTaskDTO> tasks = generateLlpAutomationTasks(plan);
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

    private List<LlpRegistrationRequest.AutomationTaskDTO> generateLlpAutomationTasks(String plan) {
        List<LlpRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // ALL PLANS (Core Process)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify Partner KYC & Office Proof", "HIGH");
        addTask(tasks, "DSC_DPIN_APPLICATION", "Apply for 2 DSC & 2 DPIN", "HIGH");
        addTask(tasks, "NAME_RESERVATION", "File RUN-LLP for Name Reservation", "MEDIUM");
        addTask(tasks, "INCORPORATION_FILING", "File FiLLiP Form with MCA", "HIGH");
        addTask(tasks, "COI_GENERATION", "Generate Certificate of Incorporation/PAN/TAN", "HIGH");
        addTask(tasks, "LLP_AGREEMENT_DRAFTING", "Draft LLP Agreement for Clients", "MEDIUM");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "LLP_AGREEMENT_FILING", "File Form-3 (LLP Agreement)", "HIGH");
            addTask(tasks, "CAPITAL_PARTNER_REGISTERS", "Generate Capital & Partner Registers", "LOW");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_REGISTRATION", "File GST Registration", "HIGH");
            addTask(tasks, "MSME_REGISTRATION", "File Udyam (MSME) Registration", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_SUPPORT", "Provide End-to-End Bank Account Support", "MEDIUM");
            addTask(tasks, "FIRST_LLP_RESOLUTION", "Draft First LLP Resolution", "LOW");
            addTask(tasks, "COMPLIANCE_GUIDANCE", "Setup 1-Year Compliance Calendar", "LOW");
        }

        return tasks;
    }

    private void addTask(List<LlpRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        LlpRegistrationRequest.AutomationTaskDTO t = new LlpRegistrationRequest.AutomationTaskDTO();
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
                return 8999.0;
            case "premium":
                return 12999.0;
            default:
                return 0.0;
        }
    }
}

