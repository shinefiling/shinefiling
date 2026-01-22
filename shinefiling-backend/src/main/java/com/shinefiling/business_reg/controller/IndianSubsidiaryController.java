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
@RequestMapping("/api/service/indian-subsidiary")
@CrossOrigin(origins = "http://localhost:5173")
public class IndianSubsidiaryController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Indian Subsidiary Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> payload) {
        try {
            // Extract details from generic payload
            String email = (String) payload.getOrDefault("userEmail", "unknown@user.com");
            String plan = (String) payload.getOrDefault("plan", "basic");

            // Serialize full payload to JSON
            String formDataStr = new ObjectMapper().writeValueAsString(payload);

            // Create Service Request
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);
            createdRequest.setPlan(plan.toUpperCase());
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

            // Set amount based on plan (approximate or extracted)
            if (payload.containsKey("amount")) {
                createdRequest.setAmount(Double.valueOf(payload.get("amount").toString()));
            } else {
                createdRequest.setAmount(getPlanAmount(plan));
            }

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 15000.0;
            case "standard":
                return 25000.0;
            case "premium":
                return 40000.0;
            default:
                return 15000.0;
        }
    }
}
