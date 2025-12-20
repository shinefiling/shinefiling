package com.shinefiling.certifications.controller;

import com.shinefiling.certifications.dto.MsmeApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.MsmeApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.service.MsmeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/service/msme-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class MsmeRegistrationController {

    @Autowired
    private MsmeService msmeService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody MsmeApplicationDTO dto, @RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        try {
            // Check for nicCodes, if it is null in DTO but present in request map, we might
            // need manual mapping if @RequestBody doesn't map it.
            // Assuming Jackson maps it correctly.
            MsmeApplication app = msmeService.createApplication(dto, user.getId());
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        try {
            return ResponseEntity.ok(msmeService.getUserApplications(user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            return ResponseEntity.ok(msmeService.getAllApplications());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        // id here corresponds to submissionId or real ID.
        // Service uses submissionId (String).
        String status = payload.get("status");
        try {
            return ResponseEntity.ok(msmeService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
