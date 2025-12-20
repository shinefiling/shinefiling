package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.FssaiRequest;
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
@RequestMapping("/api/service/fssai-license")
@CrossOrigin(origins = "http://localhost:5173")
public class FssaiController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "FSSAI License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody FssaiRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Logic to determine License Type if not sent by frontend (Double Check)
            determineLicenseType(requestDTO);

            // Generate Automation Tasks
            List<FssaiRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan based on License Type
            double baseAmount = 0;
            if ("CENTRAL".equals(requestDTO.getLicenseType()))
                baseAmount = 7499;
            else if ("STATE".equals(requestDTO.getLicenseType()))
                baseAmount = 4999;
            else
                baseAmount = 1499; // Basic Registration

            createdRequest.setPlan(requestDTO.getLicenseType().toLowerCase());
            createdRequest.setAmount(baseAmount);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private void determineLicenseType(FssaiRequest request) {
        double turnover = request.getAnnualTurnover() != null ? request.getAnnualTurnover() : 0;

        if (request.getFormData().isImporterExporter() || turnover > 200000000) { // 20 Cr
            request.setLicenseType("CENTRAL");
        } else if (turnover > 1200000) { // 12 Lakhs
            request.setLicenseType("STATE");
        } else {
            request.setLicenseType("BASIC");
        }
    }

    private List<FssaiRequest.AutomationTaskDTO> generateAutomationTasks(FssaiRequest request) {
        List<FssaiRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Document Verification
        addTask(tasks, "DOC_VERIFY", "Verify Premises Proof & Layout Compliance", "HIGH");

        // Form Filing
        if ("BASIC".equals(request.getLicenseType())) {
            addTask(tasks, "FORM_A_FILING", "File Form A for Basic Registration", "HIGH");
        } else {
            addTask(tasks, "FORM_B_FILING", "File Form B for " + request.getLicenseType() + " License", "CRITICAL");
            addTask(tasks, "FSMS_CHECK", "Verify Food Safety Management System Plan", "HIGH");
        }

        // Inspection Alert for State/Central
        if (!"BASIC".equals(request.getLicenseType())) {
            addTask(tasks, "INSPECTION_ALERT", "Coordinate for potential Hygiene Inspection", "HIGH");
        }

        return tasks;
    }

    private void addTask(List<FssaiRequest.AutomationTaskDTO> tasks, String taskName, String desc, String priority) {
        FssaiRequest.AutomationTaskDTO t = new FssaiRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
