package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.ESIFilingRequest;
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
@RequestMapping("/api/service/esi-filing")
@CrossOrigin(origins = "http://localhost:5173")
public class ESIFilingController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "ESI Monthly Filing";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ESIFilingRequest requestDTO) {
        try {
            List<ESIFilingRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Calculation Logic
            tasks.add(createTask("CALCULATE_CONTRIBUTION",
                    "Calculate 3.25% (Employer) and 0.75% (Employee) on gross wages.", "HIGH"));

            // 2. Filing
            tasks.add(createTask("GENERATE_CHALLAN",
                    "Upload contribution data to ESIC Portal and generate monthly challan.", "CRITICAL"));

            // 3. Compliance
            tasks.add(createTask("CHECK_ABSENTEEISM", "Cross-verify attendance data for zero contribution days.",
                    "NORMAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("monthly");
            createdRequest.setAmount(999.0); // Monthly Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private ESIFilingRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        ESIFilingRequest.AutomationTaskDTO t = new ESIFilingRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



