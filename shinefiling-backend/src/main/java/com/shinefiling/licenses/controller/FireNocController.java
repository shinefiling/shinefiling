package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.FireNocRequest;
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
@RequestMapping("/api/service/fire-noc")
@CrossOrigin(origins = "http://localhost:5173")
public class FireNocController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Fire Safety NOC";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody FireNocRequest requestDTO) {
        try {
            // Apply Logic: High Rise check
            double height = requestDTO.getFormData().getHeightInMeters();
            boolean isHighRise = height >= 15.0;

            // Automation Tasks
            List<FireNocRequest.AutomationTaskDTO> tasks = generateAutomationTasks(requestDTO, isHighRise);
            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Dynamic Pricing based on Building Type
            double price = 9999.0;
            if (isHighRise)
                price = 14999.0;
            if ("INDUSTRIAL".equalsIgnoreCase(requestDTO.getFormData().getBuildingType()))
                price = 19999.0;

            createdRequest.setPlan("standard");
            createdRequest.setAmount(price);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private List<FireNocRequest.AutomationTaskDTO> generateAutomationTasks(FireNocRequest request, boolean isHighRise) {
        List<FireNocRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Plan Verify
        tasks.add(createTask("PLAN_VERIFICATION", "Verify Building Plans & Floor Layouts", "CRITICAL"));

        // Access Road Check
        if (request.getFormData().getAccessRoadWidth() < 6.0) {
            tasks.add(createTask("ACCESS_ROAD_ALERT", "Road Width < 6m. Verify Fire Engine accessibility.", "HIGH"));
        }

        // Equipment Check
        if (isHighRise) {
            tasks.add(createTask("HIGH_RISE_AUDIT", "Strict Compliance Check for >15m Height (Sprinklers Mandatory)",
                    "CRITICAL"));
            if (!request.getFormData().isHasSprinklers()) {
                tasks.add(createTask("MISSING_SPRINKLERS",
                        "Alert: High Rise building missing Sprinkler system declaration.", "CRITICAL"));
            }
        }

        // Dept Filing
        tasks.add(createTask("FIRE_DEPT_FILING", "File application on State Fire Services Portal", "CRITICAL"));

        return tasks;
    }

    private FireNocRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        FireNocRequest.AutomationTaskDTO t = new FireNocRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
