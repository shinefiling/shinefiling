package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.TradeLicenseRequest;
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
@RequestMapping("/api/service/trade-license")
@CrossOrigin(origins = "http://localhost:5173")
public class TradeLicenseController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Trade License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TradeLicenseRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<TradeLicenseRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan
            createdRequest.setPlan("standard");
            createdRequest.setAmount(2999.0); // Standard Professional Fee for Trade License
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<TradeLicenseRequest.AutomationTaskDTO> generateAutomationTasks(TradeLicenseRequest request) {
        List<TradeLicenseRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Fee Calculation Task based on Area
        String feeDesc = "Calculate Municipal Fee for " + request.getCity() + ", Area: "
                + request.getFormData().getAreaSquareFeet() + " sq.ft";
        addTask(tasks, "LOCAL_FEE_CALC", feeDesc, "HIGH");

        // Document Verification
        addTask(tasks, "DOC_VERIFY", "Verify Property Tax Receipt & Ownership Proof", "HIGH");

        // Rented Premises Check
        if (request.getFormData().isRented()) {
            addTask(tasks, "NOC_CHECK", "Verify Owner NOC and Rent Agreement Validity", "CRITICAL");
        }

        // Form Filing
        addTask(tasks, "MUNICIPAL_FILING", "File on " + request.getCity() + " Municipal Corporation Portal",
                "CRITICAL");

        return tasks;
    }

    private void addTask(List<TradeLicenseRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        TradeLicenseRequest.AutomationTaskDTO t = new TradeLicenseRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
