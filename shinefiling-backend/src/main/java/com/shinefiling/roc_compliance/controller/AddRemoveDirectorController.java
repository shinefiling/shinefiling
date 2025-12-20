package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.AddRemoveDirectorRequest;
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
@RequestMapping("/api/service/add-remove-director")
@CrossOrigin(origins = "http://localhost:5173")
public class AddRemoveDirectorController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Add/Remove Director";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody AddRemoveDirectorRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();

            // Generate Automation Tasks
            List<AddRemoveDirectorRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO);
            requestDTO.setAutomationQueue(tasks);

            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("INITIATED");
            }

            // Serialize and Save
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Set Plan/Amount Logic
            createdRequest.setPlan(requestDTO.getActionType());
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

    private List<AddRemoveDirectorRequest.AutomationTaskDTO> generateAutomationTasks(AddRemoveDirectorRequest request) {
        List<AddRemoveDirectorRequest.AutomationTaskDTO> tasks = new ArrayList<>();
        AddRemoveDirectorRequest.DirectorChangeFormData data = request.getFormData();

        // Common Tasks
        addTask(tasks, "COMPANY_VALIDATION", "Verify Active Status of CIN: " + data.getCin(), "HIGH");

        if ("ADD".equalsIgnoreCase(request.getActionType())) {
            addTask(tasks, "DIN_CHECK", "Verify DIN Status of New Director", "HIGH");
            addTask(tasks, "DIR2_CONSENT", "Verify Consent Form (DIR-2)", "MEDIUM");
            addTask(tasks, "DIRECTOR_LIMIT_CHECK", "Check Max Director Limit (15)", "MEDIUM");
        } else {
            addTask(tasks, "MIN_DIRECTOR_CHECK", "Ensure Minimum Directors Maintained", "HIGH");
            addTask(tasks, "RESIGNATION_LETTER", "Verify Resignation Letter", "MEDIUM");
        }

        addTask(tasks, "BOARD_RESOLUTION_DRAFT", "Generate Draft Board Resolution", "MEDIUM");
        addTask(tasks, "DIR12_PREP", "Prepare Form DIR-12", "HIGH");

        return tasks;
    }

    private void addTask(List<AddRemoveDirectorRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        AddRemoveDirectorRequest.AutomationTaskDTO t = new AddRemoveDirectorRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
