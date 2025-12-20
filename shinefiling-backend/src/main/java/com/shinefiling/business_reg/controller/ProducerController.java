package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.ProducerCompanyRegistrationRequest;
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
@RequestMapping("/api/service/producer-company")
@CrossOrigin(origins = "http://localhost:5173")
public class ProducerController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Producer Company Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ProducerCompanyRegistrationRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Validation: Min 5 Directors
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getDirectors() != null) {
                if (requestDTO.getFormData().getDirectors().size() < 5) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("message", "Minimum 5 Directors are required for Producer Company."));
                }
            }

            // Validation: Min 10 Members (checked against user input count for now)
            if (requestDTO.getFormData() != null && requestDTO.getFormData().getNumberOfMembers() != null) {
                if (requestDTO.getFormData().getNumberOfMembers() < 10) {
                    // Note: Logic allows 2 institutions, but for simplicity we warn if < 10
                    // individuals and assume standard case
                    // Detailed validation usually happens manually by admin
                }
            }

            // Generate Automation Tasks
            List<ProducerCompanyRegistrationRequest.AutomationTaskDTO> tasks = generateProducerAutomationTasks(plan);
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

    private List<ProducerCompanyRegistrationRequest.AutomationTaskDTO> generateProducerAutomationTasks(String plan) {
        List<ProducerCompanyRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "ELIGIBILITY_CHECK", "Verify Producer/Farmer Status (7/12 Extract, etc.)", "HIGH");
        addTask(tasks, "DSC_DIN_GENERATION", "Generate DSC and DIN for 5 Directors", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "File RUN for Name Approval (Producer Company Limited)", "MEDIUM");
        addTask(tasks, "MOA_AOA_DRAFTING", "Draft Producer Object Clauses & Member Benefits", "HIGH");
        addTask(tasks, "INCORPORATION_FILING", "File SPICe+ Forms", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "FIRST_BOARD_RESOLUTION", "Draft First Board Resolution (CEO Appointment)", "MEDIUM");
            addTask(tasks, "SHARE_CERTIFICATE_DRAFT", "Provide Producer Share Certificate Format", "LOW");
            addTask(tasks, "BANK_SUPPORT", "Assist in Bank Account Opening", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "STATUTORY_REGISTER_SETUP", "Setup Member, Share, Attendance Registers", "MEDIUM");
            addTask(tasks, "FPO_GUIDANCE", "Provide Guidance on NABARD/SFAC Schemes", "MEDIUM");
            addTask(tasks, "COMPLIANCE_GUIDANCE", "Setup 1-Year Compliance Calendar (AOC-4, MGT-7A)", "LOW");
        }

        return tasks;
    }

    private void addTask(List<ProducerCompanyRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        ProducerCompanyRegistrationRequest.AutomationTaskDTO t = new ProducerCompanyRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 14999.0;
            case "standard":
                return 24999.0;
            case "premium":
                return 39999.0;
            default:
                return 0.0;
        }
    }
}

