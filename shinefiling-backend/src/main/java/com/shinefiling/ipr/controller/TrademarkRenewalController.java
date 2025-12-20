package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.TrademarkRenewalRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/service/trademark-renewal")
@CrossOrigin(origins = "http://localhost:5173")
public class TrademarkRenewalController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Trademark Renewal";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TrademarkRenewalRequest requestDTO) {
        try {
            // Automation Tasks
            List<TrademarkRenewalRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            String validity = "NORMAL";
            try {
                LocalDate expiryDate = LocalDate.parse(requestDTO.getFormData().getExpiryDate());
                LocalDate today = LocalDate.now();

                if (today.isAfter(expiryDate)) {
                    validity = "LATE";
                    tasks.add(createTask("FILE_TM_R_LATE", "File TM-R with Surcharge (Late Renewal)", "CRITICAL"));
                } else {
                    long monthsLeft = ChronoUnit.MONTHS.between(today, expiryDate);
                    if (monthsLeft > 6) {
                        // Too early logic handled by admin or queued
                        tasks.add(createTask("QUEUE_RENEWAL", "Date is > 6 months away. Queue filing.", "LOW"));
                    } else {
                        tasks.add(createTask("FILE_TM_R", "File Form TM-R (Standard Renewal)", "HIGH"));
                    }
                }
            } catch (Exception e) {
                tasks.add(createTask("VERIFY_DATE", "Manually verify expiry date", "HIGH"));
            }

            requestDTO.getFormData().setRenewalType(validity);
            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan("standard");
            createdRequest.setAmount(1999.0); // Professional Fee for Renewal
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private TrademarkRenewalRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        TrademarkRenewalRequest.AutomationTaskDTO t = new TrademarkRenewalRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}


