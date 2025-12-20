package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.OpcRegistrationRequest;
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
@RequestMapping("/api/service/one-person-company")
@CrossOrigin(origins = "http://localhost:5173")
public class OpcController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "One Person Company (OPC)";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody OpcRegistrationRequest requestDTO) {
        try {
            // 1. Extract Details
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // 2. Validate OPC-Specific Rules
            // Rule: Nominee ≠ Owner
            if (requestDTO.getFormData() != null &&
                    requestDTO.getFormData().getOwner() != null &&
                    requestDTO.getFormData().getNominee() != null) {

                String ownerPan = requestDTO.getFormData().getOwner().getPan();
                String nomineePan = requestDTO.getFormData().getNominee().getPan();

                if (ownerPan != null && ownerPan.equals(nomineePan)) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Nominee cannot be the same as Owner"));
                }
            }

            // 3. Generate Plan-Based Automation Tasks (OPC-Specific)
            List<OpcRegistrationRequest.AutomationTaskDTO> tasks = generateOpcAutomationTasks(plan);
            requestDTO.setAutomationQueue(tasks);

            // 4. Set Status if not already
            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");
            }

            // 5. Serialize to JSON for Storage in 'formData'
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);

            // 6. Create Service Request
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // 7. Update Plan & Specific Columns
            createdRequest.setPlan(plan.toUpperCase());

            if (requestDTO.getAmountPaid() != null) {
                createdRequest.setAmount(requestDTO.getAmountPaid());
            } else {
                createdRequest.setAmount(getPlanAmount(plan));
            }

            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

            // Save the updates
            serviceRequestRepository.save(createdRequest);

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        try {
            List<ServiceRequest> requests = serviceRequestService.getUserRequestsByService(email, SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<ServiceRequest> requests = serviceRequestService.getRequestsByService(SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- HELPER METHODS ---

    private List<OpcRegistrationRequest.AutomationTaskDTO> generateOpcAutomationTasks(String plan) {
        List<OpcRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Common Tasks (All Plans) - OPC Specific
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify Owner & Nominee KYC Documents", "HIGH");
        addTask(tasks, "DSC_DIN_APPLICATION", "Apply for 1 DSC & 1 DIN (Owner)", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "File RUN Service for Name Approval", "MEDIUM");
        addTask(tasks, "NOMINEE_CONSENT", "Process Nominee Consent Form (INC-3)", "HIGH");
        addTask(tasks, "MOA_AOA_DRAFTING", "Draft OPC-Specific MOA & AOA", "MEDIUM");
        addTask(tasks, "SPICE_SUBMISSION", "File SPICe+ Part B (OPC)", "HIGH");
        addTask(tasks, "COI_GENERATION", "Generate Certificate of Incorporation", "HIGH");

        // Standard & Premium
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "SHARE_CERTIFICATE", "Issue Share Certificate (Single Member)", "MEDIUM");
            addTask(tasks, "NOMINEE_REGISTER", "Prepare Nominee Register", "MEDIUM");
            addTask(tasks, "PAN_TAN_ALLOCATION", "Ensure PAN & TAN Dispatch", "MEDIUM");
        }

        // Premium Only
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_REGISTRATION", "File for GST Registration", "HIGH");
            addTask(tasks, "MSME_REGISTRATION", "File Udyam Registration", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_OPENING", "Initiate Bank Account Opening", "MEDIUM");
            addTask(tasks, "FIRST_BOARD_RESOLUTION", "Draft First Board Resolution", "LOW");
            addTask(tasks, "COMPLIANCE_CALENDAR", "Setup Annual Compliance Reminders (AOC-4, MGT-7A, ITR)", "LOW");
        }

        return tasks;
    }

    private void addTask(List<OpcRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        OpcRegistrationRequest.AutomationTaskDTO t = new OpcRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 4999.0;
            case "standard":
                return 8999.0;
            case "premium":
                return 12999.0;
            default:
                return 0.0;
        }
    }
}

