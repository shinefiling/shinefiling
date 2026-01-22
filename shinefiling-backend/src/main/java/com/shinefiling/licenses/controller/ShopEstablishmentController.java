package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.ShopEstablishmentRequest;
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
@RequestMapping("/api/service/shop-establishment")
@CrossOrigin(origins = "http://localhost:5173")
public class ShopEstablishmentController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Shop & Establishment License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ShopEstablishmentRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<ShopEstablishmentRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan
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

    private List<ShopEstablishmentRequest.AutomationTaskDTO> generateAutomationTasks(ShopEstablishmentRequest request) {
        List<ShopEstablishmentRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Fee Calculation Task
        addTask(tasks, "FEE_CALC", "Calculate Govt Fee for State: " + request.getState(), "HIGH");

        // Document Verification
        addTask(tasks, "DOC_VERIFY", "Verify Address Proof & Employee Count", "HIGH");

        // Form Filing
        addTask(tasks, "STATE_FILING", "File Application on " + request.getState() + " Labour Portal", "CRITICAL");

        // Employee Warning
        if (request.getNumberOfEmployees() > 9) {
            addTask(tasks, "COMPLIANCE_CHECK", "Verify if PF/ESIC registration is required (Employees > 9)", "HIGH");
        }

        return tasks;
    }

    private void addTask(List<ShopEstablishmentRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        ShopEstablishmentRequest.AutomationTaskDTO t = new ShopEstablishmentRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
