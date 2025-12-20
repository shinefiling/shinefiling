package com.shinefiling.financial.controller;

import com.shinefiling.financial.dto.CmaDataDTO;
import com.shinefiling.financial.model.CmaDataApplication;
import com.shinefiling.financial.service.CmaDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/cma-data-preparation")
@CrossOrigin(origins = "*")
public class CmaDataController {

    @Autowired
    private CmaDataService service;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody CmaDataDTO dto, @RequestParam String email) {
        CmaDataApplication app = service.createApplication(dto, email);
        return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "id", app.getId()));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<CmaDataApplication>> getUserApplications(@RequestParam String email) {
        return ResponseEntity.ok(service.getApplicationsByUser(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CmaDataApplication>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        CmaDataApplication updated = service.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Status Updated Successfully", "status", status));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Application not found"));
    }
}
