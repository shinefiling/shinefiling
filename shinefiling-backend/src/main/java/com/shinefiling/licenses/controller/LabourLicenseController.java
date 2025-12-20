package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.LabourLicenseRequest;
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
@RequestMapping("/api/service/labour-license")
@CrossOrigin(origins = "http://localhost:5173")
public class LabourLicenseController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Labour License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody LabourLicenseRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Automatic Eligibility Check
            if (requestDTO.getNumberOfLabourers() < 20) {
                return ResponseEntity.badRequest().body(Map.of("message",
                        "Labour License is mandatory only for 20+ employees. You may not need this."));
            }

            // Generate Automation Tasks
            List<LabourLicenseRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Calculate Govt Fee Buffer (Example Logic)
            double securityDepositEstimate = requestDTO.getNumberOfLabourers() * 500.0; // Estimate 500 per head

            createdRequest.setPlan("standard");
            createdRequest.setAmount(3999.0); // Professional Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<LabourLicenseRequest.AutomationTaskDTO> generateAutomationTasks(LabourLicenseRequest request) {
        List<LabourLicenseRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Security Deposit Calc
        String depDesc = "Calculate Security Deposit for " + request.getNumberOfLabourers() + " labourers in "
                + request.getState();
        addTask(tasks, "SECURITY_DEPOSIT_CALC", depDesc, "HIGH");

        // Agreement Review
        addTask(tasks, "AGREEMENT_REVIEW", "Verify Principal Employer Agreement vs Work Order", "CRITICAL");

        // Form Filing
        addTask(tasks, "LABOUR_DEPT_FILING", "File on " + request.getState() + " Labour Department Portal", "CRITICAL");

        return tasks;
    }

    private void addTask(List<LabourLicenseRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        LabourLicenseRequest.AutomationTaskDTO t = new LabourLicenseRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
