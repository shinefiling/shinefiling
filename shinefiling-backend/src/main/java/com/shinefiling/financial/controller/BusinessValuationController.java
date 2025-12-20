package com.shinefiling.financial.controller;

import com.shinefiling.financial.dto.BusinessValuationDTO;
import com.shinefiling.financial.model.BusinessValuationApplication;
import com.shinefiling.financial.service.BusinessValuationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/business-valuation")
@CrossOrigin(origins = "*")
public class BusinessValuationController {

    @Autowired
    private BusinessValuationService service;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody BusinessValuationDTO dto, @RequestParam String email) {
        BusinessValuationApplication app = service.createApplication(dto, email);
        return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "id", app.getId()));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<BusinessValuationApplication>> getUserApplications(@RequestParam String email) {
        return ResponseEntity.ok(service.getApplicationsByUser(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BusinessValuationApplication>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        BusinessValuationApplication updated = service.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Status Updated Successfully", "status", status));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Application not found"));
    }
}
