package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.StrikeOffRequest;
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
@RequestMapping("/api/service/strike-off")
@CrossOrigin(origins = "http://localhost:5173")
public class StrikeOffController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Strike Off Company";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody StrikeOffRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<StrikeOffRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Amount/Plan
            createdRequest.setPlan("standard");
            createdRequest.setAmount(9999.0); // Premium Closure Service
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<StrikeOffRequest.AutomationTaskDTO> generateAutomationTasks(StrikeOffRequest request) {
        List<StrikeOffRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        StrikeOffRequest.StrikeOffFormData data = request.getFormData();

        // Compliance Checks
        addTask(tasks, "COMPLIANCE_CHECK", "Verify if all Annual Returns (AOC-4/MGT-7) are filed", "CRITICAL");
        addTask(tasks, "LIABILITY_CHECK", "Verify Statement of Accounts for NIL Liabilities", "CRITICAL");

        // Document Prep
        addTask(tasks, "DRAFT_STK3_STK4", "Prepare Indemnity Bond (STK-3) and Affidavit (STK-4)", "HIGH");

        // Filing
        addTask(tasks, "STK2_FILING", "Prepare and File Form STK-2 on MCA", "CRITICAL");

        // Warning if litigation is true (though client shouldn't apply, we double
        // check)
        if (data.isPendingLitigation()) {
            addTask(tasks, "LITIGATION_ALERT", "WARNING: Client declared pending litigation. STK-2 may be rejected.",
                    "CRITICAL");
        }

        return tasks;
    }

    private void addTask(List<StrikeOffRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        StrikeOffRequest.AutomationTaskDTO t = new StrikeOffRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
