package com.shinefiling.legal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.legal.dto.LegalNoticeReplyRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.common.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/legal-notice-reply")
@CrossOrigin(origins = "http://localhost:5173")
public class LegalNoticeReplyController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    private static final String SERVICE_NAME = "Reply to Legal Notice";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody LegalNoticeReplyRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            // Automation Tasks
            List<LegalNoticeReplyRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            addTask(tasks, "ANALYSIS", "Analysis of received notice", "HIGH");
            addTask(tasks, "DRAFTING", "Drafting the reply", "HIGH");
            addTask(tasks, "CLIENT_APPROVAL", "Send draft to client for review", "MEDIUM");
            addTask(tasks, "DISPATCH", "Dispatching the reply notice", "HIGH");
            requestDTO.setAutomationQueue(tasks);

            requestDTO.setStatus("INITIATED");

            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan.toUpperCase());
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 2499.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            // Notifications
            try {
                notificationService.notifyAdmins("ORDER", "New Legal Notice Reply", "New application from " + email,
                        createdRequest.getId().toString());
                if (createdRequest.getUser() != null) {
                    notificationService.createNotification(createdRequest.getUser(), "ORDER_UPDATE",
                            "Application Received", "Your Legal Notice Reply application has been received.",
                            createdRequest.getId().toString(), "SERVICE_REQUEST");
                }
            } catch (Exception e) {
            }

            serviceRequestRepository.save(createdRequest);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private void addTask(List<LegalNoticeReplyRequest.AutomationTaskDTO> tasks, String task, String desc,
            String priority) {
        LegalNoticeReplyRequest.AutomationTaskDTO t = new LegalNoticeReplyRequest.AutomationTaskDTO();
        t.setTask(task);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        return ResponseEntity.ok(serviceRequestService.getUserRequestsByService(email, SERVICE_NAME));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            ServiceRequest updated = serviceRequestService.updateStatus(id, payload.get("status"));
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
