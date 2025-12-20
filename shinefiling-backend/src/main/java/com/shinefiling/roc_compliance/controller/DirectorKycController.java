package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.DirectorKycRequest;
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
@RequestMapping("/api/service/director-kyc")
@CrossOrigin(origins = "http://localhost:5173")
public class DirectorKycController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Director KYC (DIR-3 KYC)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody DirectorKycRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<DirectorKycRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO.getFormData());
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("KYC_PENDING");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("STANDARD"); // Only one plan usually
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 1499.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("KYC_PENDING");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<DirectorKycRequest.AutomationTaskDTO> generateAutomationTasks(
            DirectorKycRequest.KycFormData formData) {
        List<DirectorKycRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        addTask(tasks, "DIN_VALIDATION", "Verify Status of DIN " + formData.getDin(), "HIGH");
        addTask(tasks, "PAN_MATCHING", "Match Name with PAN Database", "HIGH");

        if (formData.isForeignNational()) {
            addTask(tasks, "PASSPORT_VERIFICATION", "Verify Passport Details", "HIGH");
        } else {
            addTask(tasks, "AADHAAR_VERIFICATION", "Verify Aadhaar Details", "HIGH");
        }

        addTask(tasks, "FORM_PREP", "Prepare DIR-3 KYC / Web Form", "MEDIUM");
        addTask(tasks, "MCA_SUBMISSION", "File on MCA V3 Portal", "MEDIUM");

        return tasks;
    }

    private void addTask(List<DirectorKycRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        DirectorKycRequest.AutomationTaskDTO t = new DirectorKycRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
