package com.shinefiling.business_reg.controller;

import com.shinefiling.business_reg.dto.ProprietorshipRegistrationRequest;
import com.shinefiling.business_reg.model.ProprietorshipApplication;
import com.shinefiling.business_reg.service.ProprietorshipService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/proprietorship")
@CrossOrigin(origins = "*")
public class ProprietorshipController {

    @Autowired
    private ProprietorshipService proprietorshipService;

    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(
            @RequestParam("data") String data,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ProprietorshipRegistrationRequest request = mapper.readValue(data, ProprietorshipRegistrationRequest.class);

            String userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof com.shinefiling.common.model.User) {
                userId = ((com.shinefiling.common.model.User) authentication.getPrincipal()).getId().toString();
            }

            String orderId = proprietorshipService.submitApplication(request, userId);

            return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "orderId", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/applications")
    public List<ProprietorshipApplication> getAllApplications() {
        return proprietorshipService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable String id) {
        ProprietorshipApplication app = proprietorshipService.getApplication(id);
        return app != null ? ResponseEntity.ok(app) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        proprietorshipService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status Updated"));
    }
}
