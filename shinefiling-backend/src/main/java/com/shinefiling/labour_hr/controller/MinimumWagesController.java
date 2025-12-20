package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.MinimumWagesRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/minimum-wages")
@CrossOrigin(origins = "http://localhost:5173")
public class MinimumWagesController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Minimum Wages Compliance";

    // Sample state-wise minimum wage rates (in reality, fetch from
    // database/notification)
    private static final Map<String, Map<String, Double>> STATE_MINIMUM_WAGES = new HashMap<>();

    static {
        Map<String, Double> maharashtraRates = new HashMap<>();
        maharashtraRates.put("UNSKILLED", 11000.0);
        maharashtraRates.put("SEMI_SKILLED", 12500.0);
        maharashtraRates.put("SKILLED", 14000.0);
        maharashtraRates.put("HIGHLY_SKILLED", 16000.0);
        STATE_MINIMUM_WAGES.put("MAHARASHTRA", maharashtraRates);

        Map<String, Double> karnatakaRates = new HashMap<>();
        karnatakaRates.put("UNSKILLED", 10500.0);
        karnatakaRates.put("SEMI_SKILLED", 12000.0);
        karnatakaRates.put("SKILLED", 13500.0);
        karnatakaRates.put("HIGHLY_SKILLED", 15500.0);
        STATE_MINIMUM_WAGES.put("KARNATAKA", karnatakaRates);
    }

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody MinimumWagesRequest requestDTO) {
        try {
            List<MinimumWagesRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            String state = requestDTO.getFormData().getState();
            String natureOfBusiness = requestDTO.getFormData().getNatureOfBusiness();

            // 1. Fetch State-wise Minimum Wage Notification
            tasks.add(createTask("FETCH_STATE_WAGE_NOTIFICATION",
                    "Fetch latest minimum wage notification for " + state + ".",
                    "CRITICAL"));

            // 2. Map Applicable Wage Slabs
            tasks.add(createTask("MAP_WAGE_SLABS",
                    "Map applicable wage slabs based on industry (" + natureOfBusiness + ") and skill categories.",
                    "HIGH"));

            // 3. Employee Classification
            tasks.add(createTask("CLASSIFY_EMPLOYEES",
                    "Auto-classify employees by skill category (Unskilled/Semi-Skilled/Skilled/Highly Skilled).",
                    "CRITICAL"));

            // 4. Wage Comparison & Validation
            tasks.add(createTask("COMPARE_WAGES",
                    "Compare actual wages vs minimum wages for each employee and flag shortfalls.",
                    "CRITICAL"));

            // 5. DA/VDA Inclusion Check
            tasks.add(createTask("VERIFY_DA_VDA",
                    "Verify Dearness Allowance (DA) and Variable DA (VDA) inclusion in wage calculation.",
                    "HIGH"));

            // 6. Overtime Calculation Compliance
            if (requestDTO.getFormData().getHasOvertimeWorkers()) {
                tasks.add(createTask("VALIDATE_OVERTIME",
                        "Validate overtime calculation as per Minimum Wages Act (2x normal rate).",
                        "HIGH"));
            }

            // 7. Statutory Register Preparation
            tasks.add(createTask("PREPARE_WAGE_REGISTER",
                    "Generate Wage Register with employee-wise wage details.",
                    "HIGH"));

            tasks.add(createTask("PREPARE_ATTENDANCE_REGISTER",
                    "Generate Attendance Register with working hours and overtime.",
                    "HIGH"));

            tasks.add(createTask("PREPARE_OVERTIME_REGISTER",
                    "Generate Overtime Register (if applicable).",
                    "NORMAL"));

            // 8. Payslip Format Compliance
            tasks.add(createTask("VALIDATE_PAYSLIP_FORMAT",
                    "Ensure payslip format includes all statutory components (Basic, DA, Overtime, etc.).",
                    "HIGH"));

            // 9. Compliance Gap Report
            tasks.add(createTask("GENERATE_GAP_REPORT",
                    "Generate compliance gap report highlighting underpayment and required corrections.",
                    "CRITICAL"));

            // 10. Wage Revision Tracking
            tasks.add(createTask("SETUP_REVISION_ALERTS",
                    "Set up alerts for annual/bi-annual wage revision notifications from government.",
                    "NORMAL"));

            // 11. Inspection Support (if required)
            if (requestDTO.getFormData().getRequiresInspectionSupport()) {
                tasks.add(createTask("PREPARE_INSPECTION_PACK",
                        "Prepare inspection-ready document pack for Labour Inspector.",
                        "HIGH"));
            }

            requestDTO.setAutomationQueue(tasks);
            requestDTO.setStatus("INITIATED");

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Pricing based on compliance period
            String period = requestDTO.getFormData().getCompliancePeriod();
            double amount = "ANNUAL".equals(period) ? 4999.0 : "QUARTERLY".equals(period) ? 2999.0 : 1999.0;

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

    private MinimumWagesRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        MinimumWagesRequest.AutomationTaskDTO t = new MinimumWagesRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



