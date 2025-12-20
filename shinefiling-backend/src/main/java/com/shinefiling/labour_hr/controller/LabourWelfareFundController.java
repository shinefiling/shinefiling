package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.LabourWelfareFundRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/labour-welfare-fund")
@CrossOrigin(origins = "http://localhost:5173")
public class LabourWelfareFundController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Labour Welfare Fund";

    // States where LWF is applicable
    private static final List<String> LWF_APPLICABLE_STATES = Arrays.asList(
            "TAMIL_NADU", "MAHARASHTRA", "KARNATAKA", "ANDHRA_PRADESH",
            "TELANGANA", "GUJARAT", "DELHI", "PUNJAB", "HARYANA", "MADHYA_PRADESH");

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody LabourWelfareFundRequest requestDTO) {
        try {
            List<LabourWelfareFundRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            String state = requestDTO.getFormData().getState();
            String filingType = requestDTO.getFormData().getFilingType();

            // 1. Check LWF Applicability
            if (!LWF_APPLICABLE_STATES.contains(state)) {
                tasks.add(createTask("LWF_NOT_APPLICABLE",
                        "LWF is not applicable in " + state + ". No action required.", "INFO"));
            } else {
                tasks.add(
                        createTask("VERIFY_LWF_APPLICABILITY", "Verify LWF applicability for " + state + ".", "HIGH"));

                // 2. Employee Validation
                tasks.add(createTask("VALIDATE_EMPLOYEE_LIST", "Validate employee eligibility and exemptions.",
                        "CRITICAL"));

                // 3. Contribution Calculation
                tasks.add(createTask("CALCULATE_CONTRIBUTIONS",
                        "Calculate employer and employee contributions as per " + state + " rules.", "CRITICAL"));

                // 4. Registration Tasks (if new)
                if ("REGISTRATION".equals(filingType) || requestDTO.getFormData().getLwfRegistrationNumber() == null) {
                    tasks.add(createTask("REGISTER_LWF_PORTAL", "Register establishment on " + state + " LWF Portal.",
                            "CRITICAL"));
                    tasks.add(createTask("OBTAIN_LWF_NUMBER", "Obtain LWF Registration Number.", "HIGH"));
                }

                // 5. Filing Tasks
                if ("ANNUAL_FILING".equals(filingType) || "HALF_YEARLY".equals(filingType)) {
                    tasks.add(createTask("PREPARE_LWF_RETURN",
                            "Prepare LWF return with employee details and contribution breakup.", "HIGH"));
                    tasks.add(createTask("GENERATE_CHALLAN", "Generate state-specific payment challan.", "CRITICAL"));
                    tasks.add(createTask("SET_DUE_DATE_ALERT", "Set up due date alerts for " + filingType + " filing.",
                            "NORMAL"));
                }

                // 6. Payment & Acknowledgment
                tasks.add(createTask("PROCESS_PAYMENT", "Process LWF contribution payment via state portal.",
                        "CRITICAL"));
                tasks.add(createTask("UPLOAD_ACKNOWLEDGMENT",
                        "Upload filing acknowledgment and payment receipt to client dashboard.", "HIGH"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Pricing based on filing type
            double amount = "REGISTRATION".equals(filingType) ? 2499.0 : 1999.0;

            createdRequest.setPlan("standard");
            createdRequest.setAmount(amount);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("INITIATED");

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private LabourWelfareFundRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        LabourWelfareFundRequest.AutomationTaskDTO t = new LabourWelfareFundRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



