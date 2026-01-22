package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.ProfessionalTaxRequest;
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
@RequestMapping("/api/service/labour-professional-tax")
@CrossOrigin(origins = "http://localhost:5173")
public class LabourProfessionalTaxController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Professional Tax";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody ProfessionalTaxRequest requestDTO) {
        try {
            List<ProfessionalTaxRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            String state = requestDTO.getFormData().getState();
            String serviceType = requestDTO.getFormData().getServiceType();

            // 1. State Rule Engine
            tasks.add(createTask("APPLY_STATE_RULES", "Apply " + state + " specific PT slabs and rules.", "HIGH"));

            // 2. Salary Slab Calculation
            tasks.add(createTask("CALCULATE_PT_SLABS", "Calculate employee-wise PT based on salary structure.",
                    "CRITICAL"));

            // 3. Registration Tasks (if applicable)
            if ("REGISTRATION".equals(serviceType) || "BOTH".equals(serviceType)) {
                tasks.add(createTask("REGISTER_PT_PORTAL",
                        "Apply for PT registration on state portal for " + state + ".", "CRITICAL"));
                tasks.add(
                        createTask("ENROLL_EMPLOYEES", "Enroll employees in PT system if required by state.", "HIGH"));
            }

            // 4. Filing Tasks (if applicable)
            if ("FILING".equals(serviceType) || "BOTH".equals(serviceType)) {
                tasks.add(createTask("PREPARE_PT_RETURN", "Prepare state-specific PT return format.", "HIGH"));
                tasks.add(createTask("GENERATE_CHALLAN", "Generate PT payment challan.", "CRITICAL"));
                tasks.add(createTask("SET_DUE_DATE_ALERT", "Set up due date reminders based on filing frequency.",
                        "NORMAL"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Pricing based on service type
            double defaultAmount = "BOTH".equals(serviceType) ? 2999.0 : 1999.0;
            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard");
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : defaultAmount);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private ProfessionalTaxRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        ProfessionalTaxRequest.AutomationTaskDTO t = new ProfessionalTaxRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
