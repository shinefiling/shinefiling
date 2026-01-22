package com.shinefiling.roc_compliance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.roc_compliance.dto.RocNoticeReplyRequest;
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
@RequestMapping("/api/service/roc-notice-reply")
@CrossOrigin(origins = "http://localhost:5173")
public class RocNoticeReplyController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    private static final String SERVICE_NAME = "ROC Notice Reply";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody RocNoticeReplyRequest requestDTO) {
        try {
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard";

            // Automation Tasks
            List<RocNoticeReplyRequest.AutomationTaskDTO> tasks = new ArrayList<>();
            addTask(tasks, "MCA_PORTAL_CHECK", "Check MCA records and notice details", "HIGH");
            addTask(tasks, "DRAFT_REPLY", "Drafting reply to ROC notice", "HIGH");
            addTask(tasks, "BOARD_RESOLUTION", "Prepare necessary Board Resolutions", "MEDIUM");
            addTask(tasks, "FILING", "File GNL-2 or relevant MCA form", "HIGH");
            requestDTO.setAutomationQueue(tasks);

            requestDTO.setStatus("INITIATED");

            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(plan.toUpperCase());
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 3999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            // Notifications
            try {
                notificationService.notifyAdmins("ORDER", "New ROC Notice Reply Application",
                        "New application from " + email, createdRequest.getId().toString());
                if (createdRequest.getUser() != null) {
                    notificationService.createNotification(createdRequest.getUser(), "ORDER_UPDATE",
                            "Application Received", "Your ROC Notice Reply application has been received.",
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

    private void addTask(List<RocNoticeReplyRequest.AutomationTaskDTO> tasks, String task, String desc,
            String priority) {
        RocNoticeReplyRequest.AutomationTaskDTO t = new RocNoticeReplyRequest.AutomationTaskDTO();
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
