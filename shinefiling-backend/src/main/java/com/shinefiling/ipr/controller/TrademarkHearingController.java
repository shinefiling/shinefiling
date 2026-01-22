package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.TrademarkHearingRequest;
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
@RequestMapping("/api/service/trademark-hearing")
@CrossOrigin(origins = "http://localhost:5173")
public class TrademarkHearingController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Trademark Hearing Support";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TrademarkHearingRequest requestDTO) {
        try {
            // Automation Tasks
            List<TrademarkHearingRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Schedule Prep Task
            try {
                LocalDate hearingDate = LocalDate.parse(requestDTO.getFormData().getHearingDate());
                long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), hearingDate);

                String priority = (daysLeft < 3) ? "CRITICAL" : "HIGH";

                tasks.add(createTask("HEARING_PREP", "Prepare written submissions for hearing on " + hearingDate,
                        priority));
                tasks.add(createTask("CLIENT_MOCK_SESSION", "Schedule mock session/briefing with client", "MEDIUM"));

                if ("VIDEO_CONFERENCING".equals(requestDTO.getHearingType())) {
                    tasks.add(createTask("VC_LINK_CHECK", "Verify Video Conferencing Link 24hrs prior", "HIGH"));
                }

            } catch (Exception e) {
                tasks.add(createTask("MANUAL_SCHEDULING", "Verify hearing date manually", "HIGH"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard");
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 4999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private TrademarkHearingRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        TrademarkHearingRequest.AutomationTaskDTO t = new TrademarkHearingRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
