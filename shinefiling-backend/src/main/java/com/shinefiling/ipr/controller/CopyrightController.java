package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.CopyrightRequest;
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
@RequestMapping("/api/service/copyright-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class CopyrightController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Copyright Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody CopyrightRequest requestDTO) {
        try {
            // Automation Tasks
            List<CopyrightRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Initial Filing
            tasks.add(createTask("FILE_FORM_XIV", "File Form XIV Statement of Particulars", "HIGH"));

            // 2. Work Scrutiny
            String cat = requestDTO.getFormData().getWorkCategory();
            if ("SOFTWARE".equals(cat)) {
                tasks.add(createTask("VERIFY_SOURCE_CODE", "Check Source Code (First/Last 10 Pages)", "CRITICAL"));
            } else if ("ARTISTIC".equals(cat)) {
                tasks.add(createTask("LOGO_CLEARANCE", "Ensure no TM conflict for Logo", "HIGH"));
            }

            // 3. Objection Tracker
            tasks.add(
                    createTask("START_OBJECTION_TIMER", "Start 30-day mandatory objection period tracking", "NORMAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(2999.0); // Professional Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private CopyrightRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        CopyrightRequest.AutomationTaskDTO t = new CopyrightRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}


