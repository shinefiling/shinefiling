package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.PayrollComplianceRequest;
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
@RequestMapping("/api/service/payroll-compliance")
@CrossOrigin(origins = "http://localhost:5173")
public class PayrollComplianceController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Payroll Compliance";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PayrollComplianceRequest requestDTO) {
        try {
            List<PayrollComplianceRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            // 1. Data Verification
            tasks.add(createTask("VERIFY_INPUT_DATA",
                    "Verify attendance logs and leave records for " + requestDTO.getFormData().getEmployeeCount()
                            + " employees.",
                    "HIGH"));

            // 2. Salary Processing
            tasks.add(createTask("PROCESS_SALARY",
                    "Calculate Gross, Net, TDS, PF, ESI, and other deductions.", "CRITICAL"));

            // 3. Payslip Generation
            tasks.add(createTask("GENERATE_PAYSLIPS", "Generate and distribute payslips to employees.", "HIGH"));

            // 4. Compliance Reports
            tasks.add(createTask("GENERATE_REPORTS", "Generate PF/ESI ECRs and PT reports.", "NORMAL"));

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            createdRequest.setPlan(requestDTO.getPlan() != null ? requestDTO.getPlan() : "startup");
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

    private PayrollComplianceRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        PayrollComplianceRequest.AutomationTaskDTO t = new PayrollComplianceRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}
