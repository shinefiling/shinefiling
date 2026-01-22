package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.CompanyLlpCorrectionRegistrationRequest;
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
@RequestMapping("/api/service/company-llp-correction")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyLlpCorrectionController {
    @Autowired
    private ServiceRequestService serviceRequestService;
    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    private static final String SERVICE_NAME = "Company/LLP Master Data Correction";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody CompanyLlpCorrectionRegistrationRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            List<CompanyLlpCorrectionRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("MCA_DATA_RECOVERY", "Fetch current master data from MCA portal.", "HIGH"));
            tasks.add(createTask("FORM_DRAFTING", "Draft correction forms (MGT-14 / PAS-3 etc).", "CRITICAL"));
            tasks.add(createTask("E_FILING", "File corrections on MCA portal.", "HIGH"));

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

    private CompanyLlpCorrectionRegistrationRequest.AutomationTaskDTO createTask(String task, String desc,
            String priority) {
        CompanyLlpCorrectionRegistrationRequest.AutomationTaskDTO t = new CompanyLlpCorrectionRegistrationRequest.AutomationTaskDTO();
        t.setTask(task);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
