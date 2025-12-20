package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.CompanyNameChangeRequest;
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
@RequestMapping("/api/service/company-name-change")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyNameChangeController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Company Name Change";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody CompanyNameChangeRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<CompanyNameChangeRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan
            createdRequest.setPlan("standard");
            createdRequest.setAmount(5999.0); // Premium Service
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<CompanyNameChangeRequest.AutomationTaskDTO> generateAutomationTasks(CompanyNameChangeRequest request) {
        List<CompanyNameChangeRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        CompanyNameChangeRequest.NameChangeFormData data = request.getFormData();

        // Tasks
        addTask(tasks, "NAME_AVAILABILITY",
                "Check availability of: " + data.getProposedName1() + " / " + data.getProposedName2(), "CRITICAL");
        addTask(tasks, "TRADEMARK_CHECK", "Verify Trademark Conflicts for proposed names", "HIGH");
        addTask(tasks, "RUN_FILING", "File RUN Form for Name Reservation", "HIGH");

        // After Name Approval Tasks (Placeholder for future flow)
        addTask(tasks, "MGT14_PREP", "Prepare MGT-14 for Special Resolution", "HIGH");
        addTask(tasks, "INC24_FILING", "File INC-24 for Central Govt Approval", "CRITICAL");

        return tasks;
    }

    private void addTask(List<CompanyNameChangeRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        CompanyNameChangeRequest.AutomationTaskDTO t = new CompanyNameChangeRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
