package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.ShareTransferRequest;
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
@RequestMapping("/api/service/share-transfer-filing")
@CrossOrigin(origins = "http://localhost:5173")
public class ShareTransferFilingController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Share Transfer Filing";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ShareTransferRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<ShareTransferRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Plan/Amount Logic
            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard");
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 1999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<ShareTransferRequest.AutomationTaskDTO> generateAutomationTasks(ShareTransferRequest request) {
        List<ShareTransferRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        ShareTransferRequest.ShareTransferFormData data = request.getFormData();

        // Tasks
        addTask(tasks, "AOA_CHECK", "Verify Share Transfer Restrictions in AOA", "HIGH");
        addTask(tasks, "SH4_VALIDATION", "Validate Form SH-4 (Securities Transfer Form)", "HIGH");

        // Stamp Duty Calculation (0.25% of Consideration)
        double consideration = request.getConsiderationAmount() != null ? request.getConsiderationAmount() : 0.0;
        double stampDuty = consideration * 0.0025; // 0.25%
        addTask(tasks, "STAMP_DUTY_CALC", "Verify Stamp Duty Payment (Approx ₹" + stampDuty + ")", "CRITICAL");

        addTask(tasks, "BOARD_RESOLUTION", "Draft Board Resolution for Transfer Approval", "MEDIUM");
        addTask(tasks, "SHARE_CERT_ISSUE", "Cancel Old & Issue New Share Certificate", "HIGH");
        addTask(tasks, "MGT_REGISTER_UPDATE", "Update Register of Members (MGT-1)", "MEDIUM");

        return tasks;
    }

    private void addTask(List<ShareTransferRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        ShareTransferRequest.AutomationTaskDTO t = new ShareTransferRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
