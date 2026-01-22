package com.shinefiling.certifications.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.certifications.dto.StartupIndiaDTO;
import com.shinefiling.certifications.dto.StartupIndiaRegistrationRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.certifications.service.StartupIndiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/startup-india")
@CrossOrigin(origins = "http://localhost:5173")
public class StartupIndiaController {

    @Autowired
    private StartupIndiaService startupService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Startup India Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody StartupIndiaRegistrationRequest requestDTO) {
        try {
            // 1. Data Validation & Pre-processing
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            // 2. Automation Tasks
            List<StartupIndiaRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("ELIGIBILITY_CHECK", "Verify DPIIT Eligibility Criteria.", "HIGH"));
            tasks.add(createTask("DPIIT_APPLICATION", "File Application on Startup India Portal.", "CRITICAL"));
            tasks.add(createTask("TAX_EXEMPTION_REVIEW", "Check for 80IAC Tax Exemption eligibility.", "MEDIUM"));
            tasks.add(createTask("CERT_GENERATION", "Download DPIIT Recognition Certificate.", "HIGH"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // 3. Create Service Request (Generic)
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan);
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 4999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            // 4. Create Specialized Entity (StartupIndiaApplication)
            try {
                com.shinefiling.common.model.User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));

                StartupIndiaDTO formData = requestDTO.getFormData();
                if (formData != null) {
                    startupService.createApplication(formData, user.getId());
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

    private StartupIndiaRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc,
            String priority) {
        StartupIndiaRegistrationRequest.AutomationTaskDTO t = new StartupIndiaRegistrationRequest.AutomationTaskDTO();
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

    // Keep legacy if needed
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(startupService.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            // Assuming ID is serviceRequestId for new flow, but keeping flexible
            // For now, simpler to assume generic service updates status
            serviceRequestService.updateStatus(id, payload.get("status"));
            return ResponseEntity.ok(Map.of("message", "Status Updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
