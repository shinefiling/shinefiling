package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.Section8RegistrationRequest;
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
@RequestMapping("/api/service/section-8-company")
@CrossOrigin(origins = "http://localhost:5173")
public class Section8Controller {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Section 8 Company Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Section8RegistrationRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Validation: Min 2 Directors
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getDirectors() != null) {
                if (requestDTO.getFormData().getDirectors().size() < 2) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Minimum 2 Directors are required for Section 8 Company."));
                }
            }

            // Generate Automation Tasks
            List<Section8RegistrationRequest.AutomationTaskDTO> tasks = generateSection8AutomationTasks(plan);
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

    private List<Section8RegistrationRequest.AutomationTaskDTO> generateSection8AutomationTasks(String plan) {
        List<Section8RegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify Director KYC & Charitable Objectives", "HIGH");
        addTask(tasks, "DSC_DIN_GENERATION", "Generate DSC and DIN for 2 Directors", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "File RUN for Name Approval (Charitable Suffix)", "MEDIUM");
        addTask(tasks, "LICENSE_APPLICATION", "File INC-12 for Section 8 License", "HIGH");
        addTask(tasks, "MOA_AOA_DRAFTING", "Draft Section 8 Complaint MOA & AOA", "HIGH");
        addTask(tasks, "INCORPORATION_FILING", "File SPICe+ Forms", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "12A_80G_PREPARATION", "Prepare Documents for 12A & 80G", "MEDIUM");
            addTask(tasks, "CSR_GUIDANCE", "Provide CSR Eligibility Guidance", "LOW");
            addTask(tasks, "BANK_SUPPORT", "Assist in Bank Account Opening", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "12A_80G_FILING", "File 12A & 80G Applications", "HIGH");
            addTask(tasks, "NGO_DARPAN", "Register on NGO Darpan Portal", "MEDIUM");
            addTask(tasks, "CSR_REGISTRATION", "File Form CSR-1 with MCA", "MEDIUM");
            addTask(tasks, "FIRST_BOARD_RESOLUTION", "Draft First Board Resolution", "LOW");
            addTask(tasks, "COMPLIANCE_GUIDANCE", "Setup 1-Year Statutory Compliance Calendar", "LOW");
        }

        return tasks;
    }

    private void addTask(List<Section8RegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        Section8RegistrationRequest.AutomationTaskDTO t = new Section8RegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 7999.0;
            case "standard":
                return 14999.0;
            case "premium":
                return 24999.0;
            default:
                return 0.0;
        }
    }
}

