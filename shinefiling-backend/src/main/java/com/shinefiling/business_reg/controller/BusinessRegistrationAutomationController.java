package com.shinefiling.business_reg.controller;

import com.shinefiling.business_reg.service.BusinessRegistrationAutomationService;
import com.shinefiling.common.model.AutomationJob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/business-registration/automation")
@CrossOrigin(origins = "http://localhost:5173")
public class BusinessRegistrationAutomationController {

    @Autowired
    private BusinessRegistrationAutomationService automationService;

    /**
     * Start automation for any business registration type
     * POST /api/business-registration/automation/start
     */
    @PostMapping("/start")
    public ResponseEntity<?> startAutomation(@RequestBody Map<String, String> payload) {
        try {
            String submissionId = payload.get("submissionId");
            String registrationType = payload.get("registrationType");

            if (submissionId == null || registrationType == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "submissionId and registrationType are required"));
            }

            AutomationJob job = automationService.startAutomation(submissionId, registrationType);

            return ResponseEntity.ok(Map.of(
                    "message", "Automation started successfully",
                    "jobId", job.getId(),
                    "submissionId", submissionId,
                    "status", job.getStatus(),
                    "currentStage", job.getCurrentStage()));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get automation logs for a specific submission
     * GET /api/business-registration/automation/logs/{submissionId}
     */
    @GetMapping("/logs/{submissionId}")
    public ResponseEntity<?> getAutomationLogs(@PathVariable String submissionId) {
        try {
            // Find job by submission ID
            // For now, return empty list - you can enhance this
            return ResponseEntity.ok(Map.of(
                    "submissionId", submissionId,
                    "logs", List.of()));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get automation status
     * GET /api/business-registration/automation/status/{submissionId}
     */
    @GetMapping("/status/{submissionId}")
    public ResponseEntity<?> getAutomationStatus(@PathVariable String submissionId) {
        try {
            // Return automation status
            return ResponseEntity.ok(Map.of(
                    "submissionId", submissionId,
                    "status", "RUNNING",
                    "currentStage", "DOCUMENT_GENERATION",
                    "progress", 60));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
