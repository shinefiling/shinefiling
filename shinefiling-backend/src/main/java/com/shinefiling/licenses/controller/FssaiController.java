package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.FssaiRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/service/fssai-license")
@CrossOrigin(origins = "http://localhost:5173")
public class FssaiController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "FSSAI License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody FssaiRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Logic to determine License Type if not sent by frontend (Double Check)
            determineLicenseType(requestDTO);

            // Generate Automation Tasks
            // Generate Automation Tasks - REMOVED
            // List<FssaiRequest.AutomationTaskDTO> tasks =
            // generateAutomationTasks(requestDTO);
            // requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan based on License Type
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

    private void determineLicenseType(FssaiRequest request) {
        if ("MODIFICATION".equalsIgnoreCase(request.getLicenseType())
                || "RENEWAL".equalsIgnoreCase(request.getPlan())) {
            return;
        }

        double turnover = request.getAnnualTurnover() != null ? request.getAnnualTurnover() : 0;

        if (request.getFormData() != null && request.getFormData().isImporterExporter()) {
            request.setLicenseType("CENTRAL");
            return;
        }

        if (turnover > 200000000) { // 20 Cr
            request.setLicenseType("CENTRAL");
        } else if (turnover > 1200000) { // 12 Lakhs
            request.setLicenseType("STATE");
        } else {
            request.setLicenseType("BASIC");
        }
    }

    // Automation Tasks Removed
    /*
     * private List<FssaiRequest.AutomationTaskDTO>
     * generateAutomationTasks(FssaiRequest request) {
     * // ... (removed)
     * return new ArrayList<>();
     * }
     * 
     * private void addTask(List<FssaiRequest.AutomationTaskDTO> tasks, String
     * taskName, String desc, String priority) {
     * // ... (removed)
     * }
     */
}
