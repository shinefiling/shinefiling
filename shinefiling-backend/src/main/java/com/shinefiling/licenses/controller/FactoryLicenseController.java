package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.FactoryLicenseRequest;
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
@RequestMapping("/api/service/factory-license")
@CrossOrigin(origins = "http://localhost:5173")
public class FactoryLicenseController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Factory License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody FactoryLicenseRequest requestDTO) {
        try {
            // Apply Logic: 10 with Power, 20 without Power
            int workers = requestDTO.getNumberOfWorkers();
            boolean power = requestDTO.isUsePower();

            if (power && workers < 10) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Factory License applies if > 10 workers with power."));
            }
            if (!power && workers < 20) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Factory License applies if > 20 workers without power."));
            }

            // Automation Tasks
            List<FactoryLicenseRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(6999.0); // Higher amount for Factory License
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<FactoryLicenseRequest.AutomationTaskDTO> generateAutomationTasks(FactoryLicenseRequest request) {
        List<FactoryLicenseRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Fee Calculation (Complex based on HP and Workers)
        tasks.add(createTask("CALCULATE_FEE_HP", "Calculate Govt Fee based on " + request.getNumberOfWorkers()
                + " workers and " + request.getInstalledHorsePower() + " HP", "HIGH"));

        // NOC Validation
        tasks.add(createTask("VALIDATE_NOC", "Verify Pollution (CTE/CTO) and Fire NOC validity", "CRITICAL"));

        // Site Plan Check
        tasks.add(createTask("SITE_PLAN_CHECK", "Verify Factory Layout/Site Plan compliance", "HIGH"));

        // Factory Dept Filing
        tasks.add(createTask("FACTORY_INSPECTORATE_FILING",
                "File application on " + request.getState() + " Factory Inspectorate portal", "CRITICAL"));

        return tasks;
    }

    private FactoryLicenseRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        FactoryLicenseRequest.AutomationTaskDTO t = new FactoryLicenseRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
