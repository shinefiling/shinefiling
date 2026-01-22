package com.shinefiling.certifications.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.certifications.dto.IsoApplicationDTO;
import com.shinefiling.certifications.dto.IsoRegistrationRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.certifications.service.IsoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/iso-certification")
@CrossOrigin(origins = "http://localhost:5173")
public class IsoCertificationController {

    @Autowired
    private IsoService isoService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "ISO Certification";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody IsoRegistrationRequest requestDTO) {
        try {
            // 1. Data Validation & Pre-processing
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            // 2. Automation Tasks
            List<IsoRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("DOC_REVIEW", "Review Business Scope for ISO Standards.", "HIGH"));
            tasks.add(createTask("GAP_ANALYSIS", "Conduct Gap Analysis vs ISO Reqs.", "MEDIUM"));
            tasks.add(createTask("AUDIT_PREP", "Prepare Internal Audit Report.", "HIGH"));
            tasks.add(createTask("CERT_ISSUANCE", "Coordinate with Certification Body.", "CRITICAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // 3. Create Service Request (Generic)
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan);
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 3999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            // 4. Create Specialized Entity (IsoApplication)
            try {
                com.shinefiling.common.model.User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));

                IsoApplicationDTO formData = requestDTO.getFormData();
                if (formData != null) {
                    isoService.createApplication(formData, user.getId());
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

    private IsoRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        IsoRegistrationRequest.AutomationTaskDTO t = new IsoRegistrationRequest.AutomationTaskDTO();
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

    // Keep legacy if needed by existing frontend utils before full switch
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(isoService.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        // Not implemented for generic yet in this block, but keeping legacy signature
        // if needed or switching to generic
        // Assuming generic ID for now:
        try {
            serviceRequestService.updateStatus(id, payload.get("status"));
            return ResponseEntity.ok(Map.of("message", "Status Updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
