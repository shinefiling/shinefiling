package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.GratuityActRequest;
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
@RequestMapping("/api/service/gratuity-act")
@CrossOrigin(origins = "http://localhost:5173")
public class GratuityActController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Gratuity Act Registration";
    private static final int MINIMUM_EMPLOYEE_COUNT = 10;

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody GratuityActRequest requestDTO) {
        try {
            List<GratuityActRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            int employeeCount = Integer.parseInt(requestDTO.getFormData().getEmployeeCount());
            String state = requestDTO.getFormData().getState();

            // 1. Eligibility Check
            if (employeeCount < MINIMUM_EMPLOYEE_COUNT) {
                tasks.add(createTask("ELIGIBILITY_FAILED",
                        "Gratuity Act registration requires minimum 10 employees. Current: " + employeeCount,
                        "CRITICAL"));
                requestDTO.setStatus("ELIGIBILITY_FAILED");
            } else {
                tasks.add(createTask("VERIFY_ELIGIBILITY",
                        "Verify employee count (" + employeeCount + ") meets threshold requirement.",
                        "HIGH"));

                // 2. Document Verification
                tasks.add(createTask("VERIFY_DOCUMENTS",
                        "Verify all mandatory documents: COI, PAN, Address Proof, Factory/Shop License.",
                        "CRITICAL"));

                // 3. Jurisdiction Verification
                tasks.add(createTask("VERIFY_JURISDICTION",
                        "Verify correct Labour Office jurisdiction for " + state + ".",
                        "HIGH"));

                // 4. Form A Preparation
                tasks.add(createTask("PREPARE_FORM_A",
                        "Auto-fill Form A (Notice of Opening) with establishment details.",
                        "CRITICAL"));

                // 5. State-wise Format Selection
                tasks.add(createTask("SELECT_STATE_FORMAT",
                        "Select " + state + " specific Form A format.",
                        "HIGH"));

                // 6. Portal Filing
                tasks.add(createTask("FILE_WITH_LABOUR_DEPT",
                        "File application with State Labour Department portal.",
                        "CRITICAL"));

                // 7. Acknowledgment Capture
                tasks.add(createTask("CAPTURE_ACKNOWLEDGMENT",
                        "Capture acknowledgment number and store application reference.",
                        "HIGH"));

                // 8. Status Tracking
                tasks.add(createTask("TRACK_GOVT_REVIEW",
                        "Monitor government review status and set up query alerts.",
                        "NORMAL"));

                // 9. Certificate Download
                tasks.add(createTask("DOWNLOAD_CERTIFICATE",
                        "Auto-download Gratuity Registration Certificate upon approval.",
                        "HIGH"));

                requestDTO.setStatus("INITIATED");
            }

            requestDTO.setAutomationQueue(tasks);

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Fixed pricing for Gratuity Act Registration
            double amount = 2999.0;

            createdRequest.setPlan("standard");
            createdRequest.setAmount(amount);
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus(requestDTO.getStatus());

            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private GratuityActRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        GratuityActRequest.AutomationTaskDTO t = new GratuityActRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



