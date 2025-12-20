package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.PollutionControlRequest;
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
@RequestMapping("/api/service/pollution-control")
@CrossOrigin(origins = "http://localhost:5173")
public class PollutionControlController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Pollution Control License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PollutionControlRequest requestDTO) {
        try {
            // Apply Logic: Categorization Check (Red/Orange/Green)
            String category = requestDTO.getBusinessCategory();

            // Automation Tasks
            List<PollutionControlRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Pricing based on Category and Certificate Type
            double price = 14999.0;
            if ("RED".equalsIgnoreCase(category))
                price = 24999.0;
            if ("WHITE".equalsIgnoreCase(category))
                price = 4999.0; // Minimal compliance

            createdRequest.setPlan("standard");
            createdRequest.setAmount(price);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<PollutionControlRequest.AutomationTaskDTO> generateAutomationTasks(PollutionControlRequest request) {
        List<PollutionControlRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        PollutionControlRequest.PollutionFormData data = request.getFormData();

        // ETP/STP Check for Red/Orange
        if (("RED".equalsIgnoreCase(request.getBusinessCategory())
                || "ORANGE".equalsIgnoreCase(request.getBusinessCategory()))
                && !data.isHasEtpStp()) {
            tasks.add(createTask("ETP_DESIGN_FAIL",
                    "Critical: Red/Orange Category requires ETP/STP. Coordinate with client immediately.", "CRITICAL"));
        }

        // Hazardous Waste
        if (data.isGeneratesHazardousWaste()) {
            tasks.add(createTask("HAZARODUS_AUTH", "File Form-1 for Hazardous Waste Authorization", "HIGH"));
        }

        // Water Cess (if high consumption)
        if (data.getDailyWaterConsumption() > 10.0) { // >10 KLD
            tasks.add(createTask("WATER_CESS", "Calculate Water Cess Liability", "MEDIUM"));
        }

        // Dept Filing
        tasks.add(createTask("SPCB_FILING",
                "File " + request.getCertificateType() + " Application on Pollution Control Board Portal", "CRITICAL"));

        return tasks;
    }

    private PollutionControlRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        PollutionControlRequest.AutomationTaskDTO t = new PollutionControlRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
