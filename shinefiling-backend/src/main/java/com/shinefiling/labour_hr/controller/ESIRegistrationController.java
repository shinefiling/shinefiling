package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.ESIRegistrationRequest;
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
@RequestMapping("/api/service/esi-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class ESIRegistrationController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "ESI Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ESIRegistrationRequest requestDTO) {
        try {
            List<ESIRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Threshold Validation
            try {
                int count = Integer.parseInt(requestDTO.getFormData().getEmployeeCount());
                if (count < 10) {
                    tasks.add(createTask("VERIFY_ELIGIBILITY",
                            "Employee count is < 10. Confirm if voluntary coverage needed.", "HIGH"));
                } else {
                    tasks.add(createTask("VERIFY_DOCS", "Standard Registration for eligible establishment.", "NORMAL"));
                }
            } catch (Exception e) {
                tasks.add(createTask("MANUAL_CHECK", "Verify data manually.", "NORMAL"));
            }

            // 2. Portal Registration
            tasks.add(createTask("REGISTER_ESIC_PORTAL", "File Form-01 on ESIC Employer Portal.", "CRITICAL"));

            // 3. Employee Enrollment
            tasks.add(createTask("GENERATE_IP_NUMBERS", "Register employees and generate TIC (Temporary ID Card).",
                    "HIGH"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard");
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 2499.0);
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private ESIRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        ESIRegistrationRequest.AutomationTaskDTO t = new ESIRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
