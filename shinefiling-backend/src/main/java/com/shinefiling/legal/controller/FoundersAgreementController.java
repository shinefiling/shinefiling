package com.shinefiling.legal.controller;

import com.shinefiling.legal.dto.FoundersAgreementDTO;
import com.shinefiling.legal.model.FoundersAgreementApplication;
import com.shinefiling.legal.service.FoundersAgreementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/founders-agreement")
@CrossOrigin(origins = "*")
public class FoundersAgreementController {

    @Autowired
    private FoundersAgreementService service;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody FoundersAgreementDTO dto, @RequestParam String email) {
        FoundersAgreementApplication app = service.createApplication(dto, email);
        return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "id", app.getId()));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<FoundersAgreementApplication>> getUserApplications(@RequestParam String email) {
        return ResponseEntity.ok(service.getApplicationsByUser(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<FoundersAgreementApplication>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        FoundersAgreementApplication updated = service.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Status Updated Successfully", "status", status));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Application not found"));
    }
}
