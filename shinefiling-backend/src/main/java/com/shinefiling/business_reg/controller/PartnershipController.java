package com.shinefiling.business_reg.controller;

import com.shinefiling.business_reg.dto.PartnershipRegistrationRequest;
import com.shinefiling.business_reg.model.PartnershipApplication;
import com.shinefiling.business_reg.service.PartnershipService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/partnership")
@CrossOrigin(origins = "*")
public class PartnershipController {

    @Autowired
    private PartnershipService partnershipService;

    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(
            @RequestParam("data") String data,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            PartnershipRegistrationRequest request = mapper.readValue(data, PartnershipRegistrationRequest.class);

            String userId = null;
            if (authentication != null) {
                // In real app, extract ID from auth principal
                // userId = ((User) authentication.getPrincipal()).getId().toString();
                // Simulating for now or relying on frontend to pass?
                // Actually standard pattern is to use AuthContext or pass userId if not strict.
                // We will rely on ServiceRequest logic handle "GUEST" if null.
                // Better: Pass userId in data if frontend sends it, or extract from token.
            }

            // For MVP, we might rely on the token interception filling the context.
            // Let's grab user from context if implementation allows, else null.
            if (authentication != null && authentication.getPrincipal() instanceof com.shinefiling.common.model.User) {
                userId = ((com.shinefiling.common.model.User) authentication.getPrincipal()).getId().toString();
            }

            // Fallback: If "User-Id" header or similar was passed? No, let's keep it
            // simple.

            String orderId = partnershipService.submitApplication(request, userId);

            // Handle file uploads (Mock for now, normally we'd save them to S3/Disk and
            // update entity)
            if (documents != null) {
                // partnershipService.saveDocuments(orderId, documents);
            }

            return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "orderId", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/applications")
    public List<PartnershipApplication> getAllApplications() {
        return partnershipService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable String id) {
        PartnershipApplication app = partnershipService.getApplication(id);
        return app != null ? ResponseEntity.ok(app) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        partnershipService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status Updated"));
    }
}
