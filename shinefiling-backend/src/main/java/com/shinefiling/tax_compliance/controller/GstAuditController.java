package com.shinefiling.tax_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.tax_compliance.dto.GstAuditRequest;
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
@RequestMapping("/api/service/gst-audit")
@CrossOrigin(origins = "http://localhost:5173")
public class GstAuditController {
    @Autowired
    private ServiceRequestService serviceRequestService;
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    private static final String SERVICE_NAME = "GST Audit";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody GstAuditRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            if (email == null && requestDTO.getFormData() != null && requestDTO.getFormData().containsKey("email")) {
                email = (String) requestDTO.getFormData().get("email");
            }
            if (email == null)
                email = "guest@shinefiling.com";

            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            List<GstAuditRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            GstAuditRequest.AutomationTaskDTO t1 = new GstAuditRequest.AutomationTaskDTO();
            t1.setTask("AUDIT_PROCESS");
            t1.setDescription("Initiate 9C Audit");
            t1.setPriority("HIGH");
            tasks.add(t1);

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

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, payload.get("status")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
