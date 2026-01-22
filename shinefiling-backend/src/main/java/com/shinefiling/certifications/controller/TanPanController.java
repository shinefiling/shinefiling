package com.shinefiling.certifications.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.certifications.dto.TanPanApplicationDTO;
import com.shinefiling.certifications.dto.TanPanRegistrationRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.certifications.service.TanPanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/tan-pan")
@CrossOrigin(origins = "http://localhost:5173")
public class TanPanController {

    @Autowired
    private TanPanService tanPanService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME_PAN = "PAN Application";
    private static final String SERVICE_NAME_TAN = "TAN Application";
    private static final String SERVICE_NAME_GENERIC = "PAN/TAN Application";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TanPanRegistrationRequest requestDTO) {
        try {
            // 1. Data Validation & Pre-processing
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "pan_new";

            // Determine Service Name based on Plan
            String serviceName = SERVICE_NAME_GENERIC;
            if (plan.contains("pan"))
                serviceName = SERVICE_NAME_PAN;
            else if (plan.contains("tan"))
                serviceName = SERVICE_NAME_TAN;

            // 2. Automation Tasks
            List<TanPanRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("DATA_ENTRY", "Fill Form 49A/49B on NSDL/UTIITSL.", "HIGH"));
            tasks.add(createTask("DOC_VERIFICATION", "Verify Aadhaar & DOB Proof.", "HIGH"));
            if (plan.contains("correction")) {
                tasks.add(createTask("DISCREPANCY_CHECK", "Check for Data Mismatch.", "CRITICAL"));
            }
            tasks.add(createTask("ACKNOWLEDGEMENT", "Generate Acknowledgement Receipt.", "MEDIUM"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // 3. Create Service Request (Generic)
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, serviceName, formDataStr);

            createdRequest.setPlan(plan);
            // Dynamic Pricing based on plan
            double amount = 199.0;
            if (plan.contains("tan"))
                amount = 499.0;
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : amount);

            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            // 4. Create Specialized Entity (TanPanApplication)
            try {
                com.shinefiling.common.model.User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found: " + email));

                TanPanApplicationDTO formData = requestDTO.getFormData();
                if (formData != null) {
                    tanPanService.createApplication(formData, user.getId());
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

    private TanPanRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        TanPanRegistrationRequest.AutomationTaskDTO t = new TanPanRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        try {
            // Fetch related services
            List<ServiceRequest> allRequests = new ArrayList<>();
            allRequests.addAll(serviceRequestService.getUserRequestsByService(email, SERVICE_NAME_PAN));
            allRequests.addAll(serviceRequestService.getUserRequestsByService(email, SERVICE_NAME_TAN));
            allRequests.addAll(serviceRequestService.getUserRequestsByService(email, SERVICE_NAME_GENERIC));

            return ResponseEntity.ok(allRequests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Keep legacy if needed
    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(tanPanService.getAllApplications());
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
