package com.shinefiling.ipr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.ipr.dto.TrademarkRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/trademark-registration")
@CrossOrigin(origins = "http://localhost:5173")
public class TrademarkController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Trademark Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody TrademarkRequest requestDTO) {
        try {
            // Logic: Govt Fee Estimation
            // Individual / Startup / SME: ₹4500
            // Others: ₹9000
            double govtFee = 9000.0;
            if ("INDIVIDUAL".equalsIgnoreCase(requestDTO.getApplicantType()) ||
                    "STARTUP".equalsIgnoreCase(requestDTO.getApplicantType()) ||
                    "SMALL_ENTERPRISE".equalsIgnoreCase(requestDTO.getApplicantType())) {
                govtFee = 4500.0;
            }

            // Automation Tasks
            List<TrademarkRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Search Task
            tasks.add(createTask("TM_SEARCH",
                    "Conduct comprehensive similarity search for '" + requestDTO.getBrandName() + "'", "CRITICAL"));

            // 2. Class Verification
            tasks.add(createTask("CLASS_CHECK",
                    "Verify if Goods fit in Class " + requestDTO.getFormData().getClassNumber(), "HIGH"));

            // 3. User Affidavit (if used before)
            if (!requestDTO.getFormData().isUseDateClean()) {
                tasks.add(createTask("AFFIDAVIT_DRAFTING", "Draft Usage Affidavit (Rule 25)", "HIGH"));
            }

            // 4. Filing
            tasks.add(createTask("TM_A_FILING", "File Form TM-A on IP India Portal", "CRITICAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            // Save
            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Pricing Logic (Professional Fee + approx Govt Fee)
            double professionalFee = 1999.0;
            createdRequest.setPlan("standard");
            createdRequest.setAmount(professionalFee + govtFee);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private TrademarkRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        TrademarkRequest.AutomationTaskDTO t = new TrademarkRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}


