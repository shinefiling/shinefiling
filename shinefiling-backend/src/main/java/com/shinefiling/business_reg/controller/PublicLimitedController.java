package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.PublicLimitedRegistrationRequest;
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
@RequestMapping("/api/service/public-limited-company")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicLimitedController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Public Limited Company Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PublicLimitedRegistrationRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Validation: Min 3 Directors
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getDirectors() != null) {
                if (requestDTO.getFormData().getDirectors().size() < 3) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Minimum 3 Directors are required for Public Limited Company."));
                }
            }

            // Validation: Min 7 Shareholders
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getNumberOfShareholders() != null) {
                if (requestDTO.getFormData().getNumberOfShareholders() < 7) {
                    // Warning or hard stop. We'll strict for now as it's a statutory requirement.
                    return ResponseEntity.badRequest().body(Map.of("message", "Minimum 7 Shareholders are required."));
                }
            }

            // Generate Automation Tasks
            List<PublicLimitedRegistrationRequest.AutomationTaskDTO> tasks = generatePublicLtdAutomationTasks(plan);
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

    private List<PublicLimitedRegistrationRequest.AutomationTaskDTO> generatePublicLtdAutomationTasks(String plan) {
        List<PublicLimitedRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify Director/Shareholder KYC & Capital Structure", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "File RUN for Name Approval (Limited suffix)", "MEDIUM");
        addTask(tasks, "MOA_AOA_DRAFTING", "Draft Public Limited MOA/AOA", "HIGH");
        addTask(tasks, "INCORPORATION_FILING", "File SPICe+ Forms", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "DSC_DIN_GENERATION", "Generate DSC and DIN for 3 Directors", "HIGH");
            addTask(tasks, "FIRST_BOARD_RESOLUTION", "Draft First Board Resolution", "MEDIUM");
            addTask(tasks, "SHARE_CERTIFICATES", "Issue Share Certificates", "LOW");
            addTask(tasks, "BANK_SUPPORT", "Assist in Bank Account Opening", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "STATUTORY_REGISTER_SETUP", "Setup Registers (Members, Directors, KMP)", "MEDIUM");
            addTask(tasks, "FIRST_AUDITOR_APPOINTMENT", "File ADT-1 for Auditor", "HIGH");
            addTask(tasks, "ROC_INITIAL_FILINGS", "File INC-20A (Commencement of Business)", "HIGH");
            addTask(tasks, "COMPLIANCE_GUIDANCE", "Setup 1-Year Compliance Calendar (AOC-4, MGT-7)", "LOW");
        }

        return tasks;
    }

    private void addTask(List<PublicLimitedRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        PublicLimitedRegistrationRequest.AutomationTaskDTO t = new PublicLimitedRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 19999.0;
            case "standard":
                return 34999.0;
            case "premium":
                return 59999.0;
            default:
                return 0.0;
        }
    }
}

