package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.TrademarkObjectionRequest;
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
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@RestController
@RequestMapping("/api/service/trademark-objection")
@CrossOrigin(origins = "http://localhost:5173")
public class TrademarkObjectionController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Trademark Objection Reply";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TrademarkObjectionRequest requestDTO) {
        try {
            // Automation Tasks
            List<TrademarkObjectionRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Deadline Check
            try {
                LocalDate reportDate = LocalDate.parse(requestDTO.getFormData().getExaminationReportDate());
                LocalDate deadLine = reportDate.plusDays(30);
                long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), deadLine);

                if (daysLeft < 5) {
                    tasks.add(createTask("URGENT_DRAFTING",
                            "DEADLINE IMMINENT: Draft Reply within 24 hours (" + daysLeft + " days left)", "CRITICAL"));
                } else {
                    tasks.add(createTask("DRAFT_REPLY",
                            "Draft reply addressing " + requestDTO.getObjectionType() + " objection", "HIGH"));
                }
            } catch (Exception e) {
                tasks.add(createTask("MANUAL_DATE_CHECK", "Verify deadline manually (Date parse error)", "HIGH"));
            }

            // 2. Objection Type Specific
            if ("SECTION_9".equals(requestDTO.getObjectionType())) {
                tasks.add(createTask("PROVE_DISTINCTIVENESS",
                        "Collect evidence of usage to prove distinctiveness (Sec 9)", "HIGH"));
            } else if ("SECTION_11".equals(requestDTO.getObjectionType())) {
                tasks.add(createTask("COMPARE_MARKS",
                        "Prepare detailed comparison chart vs cited conflicting marks (Sec 11)", "HIGH"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "standard");
            createdRequest.setAmount(requestDTO.getAmountPaid() != null ? requestDTO.getAmountPaid() : 2999.0);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private TrademarkObjectionRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        TrademarkObjectionRequest.AutomationTaskDTO t = new TrademarkObjectionRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
