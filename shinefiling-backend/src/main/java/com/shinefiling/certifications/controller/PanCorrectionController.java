package com.shinefiling.certifications.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.certifications.dto.PanCorrectionRegistrationRequest;
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
@RequestMapping("/api/service/pan-correction")
@CrossOrigin(origins = "http://localhost:5173")
public class PanCorrectionController {
    @Autowired
    private ServiceRequestService serviceRequestService;
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    private static final String SERVICE_NAME = "PAN Card Correction";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PanCorrectionRegistrationRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            List<PanCorrectionRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("DATA_VERIFICATION", "Verify correct details against Aadhaar.", "HIGH"));
            tasks.add(createTask("FORM_SUBMISSION", "File Correction Form 49A/49B.", "CRITICAL"));
            tasks.add(createTask("DOC_COURIER", "Track Physical Document Courier.", "MEDIUM"));

            requestDTO.setAutomationQueue(tasks);
            if (requestDTO.getStatus() == null)
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");

            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);
            createdRequest.setPlan(plan.toUpperCase());
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 0.0);
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

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, payload.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private PanCorrectionRegistrationRequest.AutomationTaskDTO createTask(String task, String desc, String priority) {
        PanCorrectionRegistrationRequest.AutomationTaskDTO t = new PanCorrectionRegistrationRequest.AutomationTaskDTO();
        t.setTask(task);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
