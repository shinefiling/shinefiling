package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.AnnualRocFilingRequest;
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
@RequestMapping("/api/service/annual-roc-filing")
@CrossOrigin(origins = "http://localhost:5173")
public class AnnualRocFilingController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Annual ROC Filing (AOC-4, MGT-7)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody AnnualRocFilingRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // Generate Automation Tasks
            List<AnnualRocFilingRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan,
                    requestDTO.getFormData());
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("FILING_INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan.toUpperCase());
            createdRequest
                    .setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : getPlanAmount(plan));
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("FILING_INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<AnnualRocFilingRequest.AutomationTaskDTO> generateAutomationTasks(String plan,
            AnnualRocFilingRequest.RocFormData formData) {
        List<AnnualRocFilingRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Core Process (All Plans)
        addTask(tasks, "FORM_IDENTIFICATION", "Identify Applicable Forms (AOC-4, MGT-7/7A)", "HIGH");
        addTask(tasks, "DUE_DATE_CALCULATION", "Calculate Due Dates based on AGM " + formData.getAgmDate(), "HIGH");
        addTask(tasks, "DATA_VERIFICATION", "Verify Capital & Director Details", "HIGH");
        addTask(tasks, "MCA_UPLOAD", "Upload Forms to MCA Portal", "HIGH");

        // Standard & Premium Extras
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "DIRECTOR_REPORT_PREP", "Draft Board Report", "MEDIUM");
            addTask(tasks, "AUDITOR_COORDINATION", "Coordinate with Auditor for Report", "MEDIUM");
            addTask(tasks, "ERROR_HANDLING", "Handle Resubmissions (if any)", "MEDIUM");
        }

        // Premium Extras
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "AGM_COMPLIANCE", "Draft AGM Notices & Minutes", "LOW");
            addTask(tasks, "NOTICE_HANDLING", "Handle ROC Notices", "LOW");
            addTask(tasks, "COMPLIANCE_CALENDAR", "Setup Future ROC Alerts", "LOW");
        }

        return tasks;
    }

    private void addTask(List<AnnualRocFilingRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        AnnualRocFilingRequest.AutomationTaskDTO t = new AnnualRocFilingRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 3999.0;
            case "standard":
                return 6999.0;
            case "premium":
                return 11999.0;
            default:
                return 0.0;
        }
    }
}
