package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.DesignRegistrationRequest;
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
@RequestMapping("/api/service/design-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class DesignRegistrationController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Design Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody DesignRegistrationRequest requestDTO) {
        try {
            // Automation Tasks
            List<DesignRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Classification
            tasks.add(createTask("DETERMINE_LOCARNO_CLASS",
                    "Identify correct Locarno Classification for " + requestDTO.getArticleName(), "HIGH"));

            // 2. Image Check
            tasks.add(createTask("VERIFY_REPRESENTATIONS",
                    "Check if Front/Back/Side/Top views comply with Design Rules", "CRITICAL"));

            // 3. Novelty Check
            if ("FALSE".equals(requestDTO.getFormData().getIsNovel())) {
                tasks.add(createTask("WARN_NOVELTY",
                        "User indicated design might not be novel. Verify prior publication.", "HIGH"));
            } else {
                tasks.add(createTask("CONFIRM_NOVELTY", "Ensure no prior publication exists", "NORMAL"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(4999.0); // Professional Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private DesignRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        DesignRegistrationRequest.AutomationTaskDTO t = new DesignRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}


