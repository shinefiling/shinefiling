package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.TrademarkAssignmentRequest;
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
@RequestMapping("/api/service/trademark-assignment")
@CrossOrigin(origins = "http://localhost:5173")
public class TrademarkAssignmentController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Trademark Assignment";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TrademarkAssignmentRequest requestDTO) {
        try {
            // Automation Tasks
            List<TrademarkAssignmentRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Deed Verification
            tasks.add(createTask("VERIFY_DEED", "Check Assignment Deed for 'Goodwill' clause compliance", "CRITICAL"));

            // 2. TM Status Check
            tasks.add(createTask("CHECK_TM_STATUS",
                    "Verify Application " + requestDTO.getApplicationNumber() + " is valid for transfer", "HIGH"));

            // 3. Form TM-P Filing
            tasks.add(createTask("FILE_TM_P", "File Form TM-P with IP India", "HIGH"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard");
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 6999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private TrademarkAssignmentRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        TrademarkAssignmentRequest.AutomationTaskDTO t = new TrademarkAssignmentRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
