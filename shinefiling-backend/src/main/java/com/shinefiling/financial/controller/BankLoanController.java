package com.shinefiling.financial.controller;

import com.shinefiling.financial.dto.BankLoanDTO;
import com.shinefiling.financial.model.BankLoanApplication;
import com.shinefiling.financial.service.BankLoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/bank-loan-documentation")
@CrossOrigin(origins = "*")
public class BankLoanController {

    @Autowired
    private BankLoanService service;

    @PostMapping("/submit")
    public ResponseEntity<?> submitApplication(@RequestBody BankLoanDTO dto, @RequestParam String email) {
        BankLoanApplication app = service.createApplication(dto, email);
        return ResponseEntity.ok(Map.of("message", "Application Submitted Successfully", "id", app.getId()));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<BankLoanApplication>> getUserApplications(@RequestParam String email) {
        return ResponseEntity.ok(service.getApplicationsByUser(email));
    }

    @GetMapping("/all")
    public ResponseEntity<List<BankLoanApplication>> getAllApplications() {
        return ResponseEntity.ok(service.getAllApplications());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        BankLoanApplication updated = service.updateStatus(id, status);
        if (updated != null) {
            return ResponseEntity.ok(Map.of("message", "Status Updated Successfully", "status", status));
        }
        return ResponseEntity.badRequest().body(Map.of("message", "Application not found"));
    }
}
