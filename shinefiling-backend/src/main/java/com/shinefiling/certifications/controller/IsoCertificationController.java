package com.shinefiling.certifications.controller;

import com.shinefiling.certifications.dto.IsoApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.service.IsoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/service/iso-certification")
@CrossOrigin(origins = "http://localhost:5173")
public class IsoCertificationController {

    @Autowired
    private IsoService isoService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody IsoApplicationDTO dto, @RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        try {
            return ResponseEntity.ok(isoService.createApplication(dto, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(isoService.getUserApplications(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(isoService.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(isoService.updateStatus(id, payload.get("status")));
    }
}
