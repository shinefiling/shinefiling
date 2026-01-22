package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.BarLiquorRequest;
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
@RequestMapping("/api/service/bar-liquor")
@CrossOrigin(origins = "http://localhost:5173")
public class BarLiquorController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Bar & Liquor License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody BarLiquorRequest requestDTO) {
        try {
            // Logic: Distance Check
            double distance = requestDTO.getFormData().getDistanceFromSchoolOrTemple();

            // Automation Tasks
            List<BarLiquorRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Distance Violation Check (Strict Rule: > 50-100m depending on state,
            // flagging if < 100)
            if (distance < 100.0) {
                tasks.add(createTask("DISTANCE_VIOLATION_CHECK",
                        "Critical: Premises is within 100m of School/Religion. Verify Local Rules.", "CRITICAL"));
            }

            // 2. NOC Checks
            if (!requestDTO.getFormData().isHasPoliceNoc()) {
                tasks.add(createTask("POLICE_VERIFICATION_INIT",
                        "Initiate Police Verification / Certificate of Good Character", "HIGH"));
            }
            if (!requestDTO.getFormData().isHasFireNoc()) {
                tasks.add(createTask("FIRE_NOC_REQUIRED",
                        "Establishment needs Fire Safety NOC before Excise Application", "HIGH"));
            }

            // 3. Excise Filing
            tasks.add(createTask("EXCISE_FILING",
                    "File application on State Excise Portal (" + requestDTO.getState() + ")", "CRITICAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan());
            createdRequest.setAmount(requestDTO.getAmountPaid());
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private BarLiquorRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        BarLiquorRequest.AutomationTaskDTO t = new BarLiquorRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
