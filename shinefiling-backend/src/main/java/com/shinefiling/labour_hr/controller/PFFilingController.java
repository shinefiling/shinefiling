package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.PFFilingRequest;
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
@RequestMapping("/api/service/pf-filing")
@CrossOrigin(origins = "http://localhost:5173")
public class PFFilingController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "PF Monthly Filing";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PFFilingRequest requestDTO) {
        try {
            List<PFFilingRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Data Validation
            tasks.add(createTask("VALIDATE_SALARY_SHEET", "Check Basic + DA logic and 12% contribution calculation.",
                    "HIGH"));

            // 2. ECR Generation
            tasks.add(createTask("GENERATE_ECR", "Create Text File for Electronic Challan-cum-Return.", "CRITICAL"));

            // 3. Deadline Check
            tasks.add(createTask("CHECK_DUE_DATE", "Ensure filing before 15th to avoid penalty.", "HIGH"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("monthly");
            createdRequest.setAmount(999.0); // Monthly Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private PFFilingRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        PFFilingRequest.AutomationTaskDTO t = new PFFilingRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



