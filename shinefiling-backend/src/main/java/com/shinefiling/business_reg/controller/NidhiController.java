package com.shinefiling.business_reg.controller;

import com.shinefiling.business_reg.dto.NidhiRegistrationRequest;
import com.shinefiling.business_reg.model.NidhiApplication;
import com.shinefiling.business_reg.service.NidhiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/nidhi")
@CrossOrigin(origins = "*")
public class NidhiController {

    @Autowired
    private NidhiService nidhiService;

    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(
            @RequestParam("data") String data,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents,
            Authentication authentication) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            NidhiRegistrationRequest request = mapper.readValue(data, NidhiRegistrationRequest.class);

            String userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof com.shinefiling.common.model.User) {
                userId = ((com.shinefiling.common.model.User) authentication.getPrincipal()).getId().toString();
            }

            String orderId = nidhiService.submitApplication(request, userId);

            return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "orderId", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/applications")
    public List<NidhiApplication> getAllApplications() {
        return nidhiService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable String id) {
        NidhiApplication app = nidhiService.getApplication(id);
        return app != null ? ResponseEntity.ok(app) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        nidhiService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status Updated"));
    }
}
