package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.MoaAoaAmendmentRequest;
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
@RequestMapping("/api/service/moa-aoa-amendment")
@CrossOrigin(origins = "http://localhost:5173")
public class MoaAoaAmendmentController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "MOA/AOA Amendment";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody MoaAoaAmendmentRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<MoaAoaAmendmentRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan
            createdRequest.setPlan("standard");
            createdRequest.setAmount(4999.0); // Base Price
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<MoaAoaAmendmentRequest.AutomationTaskDTO> generateAutomationTasks(MoaAoaAmendmentRequest request) {
        List<MoaAoaAmendmentRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Tasks
        addTask(tasks, "CLAUSE_VERIFY", "Legal Verification of Proposed Clause: " + request.getReasonForAmendment(),
                "HIGH");

        if ("BOTH".equalsIgnoreCase(request.getAmendmentType())) {
            addTask(tasks, "MOA_DRAFT", "Draft Altered MOA", "HIGH");
            addTask(tasks, "AOA_DRAFT", "Draft Altered AOA", "HIGH");
        } else if ("MOA".equalsIgnoreCase(request.getAmendmentType())) {
            addTask(tasks, "MOA_DRAFT", "Draft Altered MOA", "HIGH");
        } else {
            addTask(tasks, "AOA_DRAFT", "Draft Altered AOA", "HIGH");
        }

        addTask(tasks, "MGT14_PREP", "Prepare Form MGT-14 (Special Resolution)", "CRITICAL");

        // If name change is mentioned in reason? (Simple keyword check, can be advanced
        // later)
        if (request.getReasonForAmendment() != null && request.getReasonForAmendment().toLowerCase().contains("name")) {
            addTask(tasks, "INC24_CHECK", "Check if INC-24 is required for Name Change", "HIGH");
        }

        return tasks;
    }

    private void addTask(List<MoaAoaAmendmentRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        MoaAoaAmendmentRequest.AutomationTaskDTO t = new MoaAoaAmendmentRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
