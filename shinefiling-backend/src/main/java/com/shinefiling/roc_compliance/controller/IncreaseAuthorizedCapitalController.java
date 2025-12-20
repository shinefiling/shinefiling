package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.IncreaseAuthorizedCapitalRequest;
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
@RequestMapping("/api/service/increase-authorized-capital")
@CrossOrigin(origins = "http://localhost:5173")
public class IncreaseAuthorizedCapitalController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Increase Authorized Capital";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody IncreaseAuthorizedCapitalRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<IncreaseAuthorizedCapitalRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount
            createdRequest.setPlan("standard");
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

    private List<IncreaseAuthorizedCapitalRequest.AutomationTaskDTO> generateAutomationTasks(
            IncreaseAuthorizedCapitalRequest request) {
        List<IncreaseAuthorizedCapitalRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        double diff = (request.getNewCapital() != null ? request.getNewCapital() : 0)
                - (request.getExistingCapital() != null ? request.getExistingCapital() : 0);

        // Tasks
        addTask(tasks, "MOA_CHECK", "Verify Capital Clause in MOA", "HIGH");
        addTask(tasks, "FEE_CALC", "Verify ROC Fee Payment for increase of Rs. " + diff, "CRITICAL");
        addTask(tasks, "MGT14_CHECK", "Check MGT-14 filing for Special Resolution", "HIGH");
        addTask(tasks, "SH7_PREP", "Prepare Form SH-7 for Capital Increase", "HIGH");
        addTask(tasks, "STAMP_DUTY_MOA", "Check Stamp Duty on Altered MOA", "MEDIUM");

        return tasks;
    }

    private void addTask(List<IncreaseAuthorizedCapitalRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        IncreaseAuthorizedCapitalRequest.AutomationTaskDTO t = new IncreaseAuthorizedCapitalRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
