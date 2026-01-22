package com.shinefiling.business_reg.controller;

import com.shinefiling.business_reg.dto.LlpRegistrationRequest;
import com.shinefiling.business_reg.model.LlpApplication;
import com.shinefiling.business_reg.service.LlpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/service/llp")
@CrossOrigin(origins = "*")
public class LlpController {

    @Autowired
    private LlpService llpService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForLlp(
            @RequestParam("data") String data,
            @RequestParam(value = "documents", required = false) List<MultipartFile> documents) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            LlpRegistrationRequest request = mapper.readValue(data, LlpRegistrationRequest.class);

            // Handle docs if needed (stub implementation for now just logs)
            if (documents != null) {
                // In production, save to S3/Local and update request
            }

            String orderId = llpService.submitApplication(request, "USER_123"); // Mock User ID
            return ResponseEntity.ok(Map.of("message", "LLP Application submitted successfully", "orderId", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/applications")
    public List<LlpApplication> getAllApplications() {
        return llpService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable String id) {
        LlpApplication app = llpService.getApplication(id);
        if (app == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(app);
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        llpService.updateStatus(id, body.get("status"));
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}
