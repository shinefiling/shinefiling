package com.shinefiling.business_reg.controller;

import com.shinefiling.business_reg.dto.Section8RegistrationRequest;
import com.shinefiling.business_reg.model.Section8Application;
import com.shinefiling.business_reg.service.Section8Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/section8")
@CrossOrigin(origins = "*")
public class Section8Controller {

    @Autowired
    private Section8Service section8Service;

    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(
            @RequestParam("data") String data,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Section8RegistrationRequest request = mapper.readValue(data, Section8RegistrationRequest.class);

            String userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof com.shinefiling.common.model.User) {
                userId = ((com.shinefiling.common.model.User) authentication.getPrincipal()).getId().toString();
            }

            String orderId = section8Service.submitApplication(request, userId);

            return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "orderId", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/applications")
    public List<Section8Application> getAllApplications() {
        return section8Service.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable String id) {
        Section8Application app = section8Service.getApplication(id);
        return app != null ? ResponseEntity.ok(app) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        section8Service.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status Updated"));
    }
}
