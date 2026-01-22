package com.shinefiling.certifications.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.certifications.dto.MsmeApplicationDTO;
import com.shinefiling.certifications.dto.MsmeRegistrationRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.certifications.service.MsmeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/msme-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class MsmeRegistrationController {

    @Autowired
    private MsmeService msmeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "MSME Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody MsmeRegistrationRequest requestDTO) {
        try {
            // 1. Data Validation & Pre-processing
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            // 2. Automation Tasks
            List<MsmeRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("VERIFY_DOCS", "Verify Aadhaar linked with Mobile & PAN.", "HIGH"));
            tasks.add(createTask("NIC_CODE_SELECTION", "Select appropriate NIC Codes based on activity.", "MEDIUM"));
            tasks.add(createTask("UDYAM_FILING", "File application on Udyam Registration Portal.", "CRITICAL"));
            tasks.add(createTask("CERTIFICATE_GENERATION", "Download and upload Udyam Certificate.", "HIGH"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // 3. Create Service Request (Generic)
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan);
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 1499.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            // 4. Create Specialized Entity (MsmeApplication)
            // We reuse the existing service logic if we can map DTO
            try {
                com.shinefiling.common.model.User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));

                MsmeApplicationDTO formData = requestDTO.getFormData();
                if (formData != null) {
                    // map any extra fields if needed, or pass directly
                    // service expects DTO
                    msmeService.createApplication(formData, user.getId());
                }
            } catch (Exception e) {
                System.err.println("Warning: Specialized Entity Creation Failed: " + e.getMessage());
                // We don't fail the whole request because ServiceRequest is created
            }

            return ResponseEntity.ok(createdRequest);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private MsmeRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        MsmeRegistrationRequest.AutomationTaskDTO t = new MsmeRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }

    // Keep legacy endpoints for now if needed, or remove them.
    // User asked to "create panni" (create new/refactor), so simpler is better.
    // I will keep get methods but rely on Generic Service Request for list mostly.

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        try {
            // Prefer Generic Service Request List
            List<ServiceRequest> requests = serviceRequestService.getUserRequestsByService(email, SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
