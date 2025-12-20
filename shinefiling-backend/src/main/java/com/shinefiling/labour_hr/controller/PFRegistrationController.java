package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.PFRegistrationRequest;
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
@RequestMapping("/api/service/pf-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class PFRegistrationController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "PF Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PFRegistrationRequest requestDTO) {
        try {
            List<PFRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Eligibility Check
            try {
                int count = Integer.parseInt(requestDTO.getFormData().getEmployeeCount());
                if (count < 20) {
                    tasks.add(createTask("VERIFY_VOLUNTARY_REG",
                            "Company has <20 employees. Verify Voluntary Registration consent.", "HIGH"));
                } else {
                    tasks.add(createTask("VERIFY_MANDATORY_REG", "Company has 20+ employees. Standard Registration.",
                            "NORMAL"));
                }
            } catch (NumberFormatException e) {
                tasks.add(createTask("CHECK_COUNT", "Verify Employee Count manually.", "HIGH"));
            }

            // 2. Portal Creation
            tasks.add(createTask("CREATE_EPFO_LOGIN", "Register on Shram Suvidha / EPFO Portal.", "HIGH"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(1999.0); // Professional Fee
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private PFRegistrationRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        PFRegistrationRequest.AutomationTaskDTO t = new PFRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



