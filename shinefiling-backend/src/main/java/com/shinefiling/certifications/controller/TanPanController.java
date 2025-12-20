package com.shinefiling.certifications.controller;

import com.shinefiling.certifications.dto.TanPanApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.service.TanPanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/service/tan-pan")
@CrossOrigin(origins = "http://localhost:5173")
public class TanPanController {

    @Autowired
    private TanPanService tanPanService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody TanPanApplicationDTO dto, @RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        try {
            return ResponseEntity.ok(tanPanService.createApplication(dto, user.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(tanPanService.getUserApplications(user.getId()));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(tanPanService.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(tanPanService.updateStatus(id, payload.get("status")));
    }
}
