package com.shinefiling.financial.controller;

import com.shinefiling.financial.dto.PitchDeckDTO;
import com.shinefiling.financial.model.PitchDeckApplication;
import com.shinefiling.financial.service.PitchDeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/startup-pitch-deck")
@CrossOrigin(origins = "*")
public class PitchDeckController {

    @Autowired
    private PitchDeckService service;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody PitchDeckDTO dto, @RequestParam String email) {
        PitchDeckApplication app = service.createApplication(dto, email);
        return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "id", app.getId()));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<PitchDeckApplication>> getUserApplications(@RequestParam String email) {
        return ResponseEntity.ok(service.getApplicationsByUser(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<PitchDeckApplication>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        PitchDeckApplication updated = service.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Status Updated Successfully", "status", status));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Application not found"));
    }
}
