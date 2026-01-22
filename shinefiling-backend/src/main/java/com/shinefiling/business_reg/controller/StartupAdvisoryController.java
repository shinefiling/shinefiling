package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/service/startup-advisory")
@CrossOrigin(origins = "http://localhost:5173")
public class StartupAdvisoryController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Startup Advisory";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.getOrDefault("userEmail", "unknown@user.com");
            String plan = (String) payload.getOrDefault("plan", "consultation");

            String formDataStr = new ObjectMapper().writeValueAsString(payload);

            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);
            createdRequest.setPlan(plan.toUpperCase());
            createdRequest.setPaymentStatus("PENDING"); // Advisory might be paid later or free
            createdRequest.setStatus("REQUEST_RECEIVED");

            createdRequest.setAmount(999.0); // Basic consultation fee

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
