package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.ChangeRegisteredOfficeRequest;
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
@RequestMapping("/api/service/change-registered-office")
@CrossOrigin(origins = "http://localhost:5173")
public class ChangeRegisteredOfficeController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Change of Registered Office";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ChangeRegisteredOfficeRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<ChangeRegisteredOfficeRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Plan/Amount Logic
            createdRequest.setPlan(requestDTO.getChangeType());
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 1999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<ChangeRegisteredOfficeRequest.AutomationTaskDTO> generateAutomationTasks(
            ChangeRegisteredOfficeRequest request) {
        List<ChangeRegisteredOfficeRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        String type = request.getChangeType();

        // Common Tasks
        addTask(tasks, "ADDRESS_PROOF_VERIFY", "Verify Electricity Bill / Rent Agreement", "HIGH");
        addTask(tasks, "NOC_CHECK", "Verify NOC from Owner", "MEDIUM");
        addTask(tasks, "INC22_PREP", "Prepare Form INC-22", "HIGH");

        // Logic Based on Change Types
        if ("SAME_CITY".equalsIgnoreCase(type)) {
            addTask(tasks, "ReSOLUTION_DRAFT", "Draft Board Resolution", "MEDIUM");
        } else if ("SAME_ROC".equalsIgnoreCase(type)) {
            addTask(tasks, "MGT14_CHECK", "Check if MGT-14 is required (Special Resolution)", "HIGH");
            addTask(tasks, "RESOLUTION_DRAFT", "Draft Special Resolution", "HIGH");
        } else if ("DIFFERENT_ROC".equalsIgnoreCase(type) || "DIFFERENT_STATE".equalsIgnoreCase(type)) {
            addTask(tasks, "RD_APPROVAL_REQ", "Regional Director Approval Required (INC-23)", "CRITICAL");
            addTask(tasks, "NEWSPAPER_AD", "Newspaper Advertisement Evidence Check", "HIGH");
        }

        return tasks;
    }

    private void addTask(List<ChangeRegisteredOfficeRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        ChangeRegisteredOfficeRequest.AutomationTaskDTO t = new ChangeRegisteredOfficeRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
