package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.IecRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/service/iec")
@CrossOrigin(origins = "http://localhost:5173")
public class IecController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Import Export Code";
    private static final Pattern PAN_PATTERN = Pattern.compile("[A-Z]{5}[0-9]{4}[A-Z]{1}");

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody IecRequest requestDTO) {
        try {
            // Validate PAN
            if (requestDTO.getFirmPan() != null && !PAN_PATTERN.matcher(requestDTO.getFirmPan()).matches()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid PAN Format"));
            }

            // Automation Tasks
            List<IecRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            tasks.add(createTask("PAN_VERIFICATION", "Verify PAN against CBDT Database", "HIGH"));
            tasks.add(createTask("BANK_VALIDATION", "Validate Bank Account for Foreign Exchange", "HIGH"));
            tasks.add(createTask("DGFT_FILING", "File Application on DGFT Portal", "CRITICAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(1999.0); // Standard Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private IecRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        IecRequest.AutomationTaskDTO t = new IecRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
