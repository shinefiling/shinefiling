package com.shinefiling.legal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.legal.dto.PartnershipDeedDTO;
import com.shinefiling.legal.dto.PartnershipDeedRegistrationRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.legal.service.PartnershipDeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/partnership-deed")
@CrossOrigin(origins = "http://localhost:5173")
public class PartnershipDeedController {

    @Autowired
    private PartnershipDeedService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Partnership Deed Drafting";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PartnershipDeedRegistrationRequest requestDTO) {
        try {
            // 1. Data Validation & Pre-processing
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            // 2. Automation Tasks
            List<PartnershipDeedRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("DRAFTING", "Drafting of Partnership Deed by Legal Expert.", "HIGH"));
            tasks.add(createTask("REVIEW", "Internal Legal Review.", "MEDIUM"));
            tasks.add(createTask("CLIENT_APPROVAL", "Share Draft with Client for Approval.", "HIGH"));
            tasks.add(createTask("FINALIZATION", "Finalize Deed on Stamp Paper (if opted).", "CRITICAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // 3. Create Service Request (Generic)
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan);
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 1999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            // 4. Create Specialized Entity
            try {
                com.shinefiling.common.model.User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));

                PartnershipDeedDTO formData = requestDTO.getFormData();
                if (formData != null) {
                    service.createApplication(formData, email);
                }
            } catch (Exception e) {
                System.err.println("Warning: Specialized Entity Creation Failed: " + e.getMessage());
            }

            return ResponseEntity.ok(createdRequest);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private PartnershipDeedRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc,
            String priority) {
        PartnershipDeedRegistrationRequest.AutomationTaskDTO t = new PartnershipDeedRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
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
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            serviceRequestService.updateStatus(id, payload.get("status"));
            return ResponseEntity.ok(Map.of("message", "Status Updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
