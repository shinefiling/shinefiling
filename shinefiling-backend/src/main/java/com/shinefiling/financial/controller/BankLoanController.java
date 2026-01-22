package com.shinefiling.financial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.financial.dto.BankLoanDTO;
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
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody BankLoanDTO request) {
        try {
            java.util.Map<String, Object> finalData = request.getFormData() != null
                    ? new java.util.HashMap<>(request.getFormData())
                    : new java.util.HashMap<>();
            finalData.put("submissionId", request.getSubmissionId());
            finalData.put("automationQueue", "PRE_PROCESSING");

            serviceRequestService.submitApplication(
                    request.getUserEmail(),
                    "BANK_LOAN_DOCUMENTATION",
                    objectMapper.writeValueAsString(finalData),
                    objectMapper.writeValueAsString(request.getDocuments()),
                    request.getPlan(),
                    request.getAmountPaid(),
                    request.getStatus() != null ? request.getStatus() : "PENDING");

            return ResponseEntity.ok(Map.of(
                    "message", "Application submitted successfully",
                    "submissionId", request.getSubmissionId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getUserApplications(@RequestParam String email) {
        return ResponseEntity.ok(serviceRequestService.getUserRequestsByService(email, "BANK_LOAN_DOCUMENTATION"));
    }
}
