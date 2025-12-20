package com.shinefiling.licenses.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.licenses.dto.GumasthaRequest;
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
@RequestMapping("/api/service/gumastha-license")
@CrossOrigin(origins = "http://localhost:5173")
public class GumasthaController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Gumastha License";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody GumasthaRequest requestDTO) {
        try {
            // Automation Tasks
            List<GumasthaRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Municipal Jurisdiction
            String city = requestDTO.getCity();
            if ("Mumbai".equalsIgnoreCase(city))
                tasks.add(createTask("MCGM_FILING", "File application on McGM Portal", "CRITICAL"));
            else if ("Pune".equalsIgnoreCase(city))
                tasks.add(createTask("PMC_FILING", "File application on PMC Portal", "CRITICAL"));
            else
                tasks.add(createTask("MUNICIPAL_CHECK", "Determine local municipal authority", "HIGH"));

            // 2. NOC Check
            if (requestDTO.getFormData().isRented()) {
                tasks.add(createTask("NOC_VERIFICATION", "Verify NOC from Owner / Society", "HIGH"));
            }

            // 3. Labour Law (if employees > 9)
            if (requestDTO.getFormData().getNumberOfEmployees() > 9) {
                tasks.add(createTask("SHOP_EST_REG", "Establishment requires formal Shop Act Registration (Form F)",
                        "MEDIUM"));
            } else {
                tasks.add(createTask("INTIMATION_FILING", "File 'Intimation' (Form F) for < 10 employees", "MEDIUM"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(1499.0); // Standard
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private GumasthaRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        GumasthaRequest.AutomationTaskDTO t = new GumasthaRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
