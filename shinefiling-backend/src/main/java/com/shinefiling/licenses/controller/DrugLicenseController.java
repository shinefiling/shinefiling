package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.DrugLicenseRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/service/drug-license")
@CrossOrigin(origins = "http://localhost:5173")
public class DrugLicenseController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Drug License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody DrugLicenseRequest requestDTO) {
        try {
            // Apply Logic: Area Validations
            double area = requestDTO.getFormData().getAreaInSqMeters(); // sqm
            String type = requestDTO.getLicenseType();

            if ("RETAIL".equalsIgnoreCase(type) && area < 10.0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Retail Drug License requires minimum 10 Sq. Meters carpet area."));
            }
            if ("WHOLESALE".equalsIgnoreCase(type) && area < 10.0) {
                // Some states 10, some 15. Usually 15 recommended for stockists. Let's warn or
                // strict check.
                // Strict check: 10 is absolute min for standalone. 15 for combined.
                return ResponseEntity.badRequest().body(Map.of("message",
                        "Wholesale Drug License requires minimum 10 Sq. Meters area (15 Sq. Meters if combined with Retail)."));
            }

            // Automation Tasks - REMOVED
            // List<DrugLicenseRequest.AutomationTaskDTO> tasks =
            // generateAutomationTasks(requestDTO);
            // requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan());
            createdRequest.setAmount(requestDTO.getAmountPaid());
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Automation Removed
    /*
     * private List<DrugLicenseRequest.AutomationTaskDTO>
     * generateAutomationTasks(DrugLicenseRequest request) {
     * // ...
     * return new ArrayList<>();
     * }
     * 
     * private DrugLicenseRequest.AutomationTaskDTO createTask(String taskName,
     * String desc, String priority) {
     * // ...
     * return new DrugLicenseRequest.AutomationTaskDTO();
     * }
     */
}
