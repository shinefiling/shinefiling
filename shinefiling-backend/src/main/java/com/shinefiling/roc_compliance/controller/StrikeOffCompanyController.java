package com.shinefiling.roc_compliance.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.service.ServiceRequestService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/strike-off-company")
@CrossOrigin(origins = "http://localhost:5173")
public class StrikeOffCompanyController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    private static final String SERVICE_NAME = "Strike Off Company";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        Map<String, Object> formMap = new HashMap<>(payload);
        formMap.remove("email");
        String formDataStr = "{}";
        try {
            formDataStr = new ObjectMapper().writeValueAsString(formMap);
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            ServiceRequest request = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        try {
            List<ServiceRequest> requests = serviceRequestService.getUserRequestsByService(email, SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<ServiceRequest> requests = serviceRequestService.getRequestsByService(SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
