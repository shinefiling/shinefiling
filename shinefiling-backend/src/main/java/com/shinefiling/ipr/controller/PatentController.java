package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.PatentRequest;
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
@RequestMapping("/api/service/patent-filing")
@CrossOrigin(origins = "http://localhost:5173")
public class PatentController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Patent Filing";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PatentRequest requestDTO) {
        try {
            // Automation Tasks
            List<PatentRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Filing Logic
            String type = requestDTO.getFormData().getFilingType();
            if ("PROVISIONAL".equals(type)) {
                tasks.add(createTask("DRAFT_PROVISIONAL", "Draft Provisional Specification (Broad Claims)", "HIGH"));
                tasks.add(createTask("SET_12_MONTH_TIMER", "Start 12-month deadline tracker for Complete Spec",
                        "NORMAL"));
            } else {
                tasks.add(createTask("DRAFT_COMPLETE", "Draft Complete Specification (Detailed Claims)", "CRITICAL"));
            }

            // 2. Examination
            if ("TRUE".equals(requestDTO.getFormData().getRequestExamination())) {
                tasks.add(createTask("FILE_FORM_18", "File Request for Examination immediately", "HIGH"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(14999.0); // Professional Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private PatentRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        PatentRequest.AutomationTaskDTO t = new PatentRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}


