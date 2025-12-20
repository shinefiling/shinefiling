package com.shinefiling.labour_hr.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.labour_hr.dto.BonusActRequest;
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
@RequestMapping("/api/service/bonus-act")
@CrossOrigin(origins = "http://localhost:5173")
public class BonusActController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    private static final String SERVICE_NAME = "Bonus Act Compliance";
    private static final int MINIMUM_EMPLOYEE_COUNT = 20;
    private static final double SALARY_LIMIT = 21000.0;
    private static final double MINIMUM_BONUS_PERCENTAGE = 8.33;
    private static final double MAXIMUM_BONUS_PERCENTAGE = 20.0;

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody BonusActRequest requestDTO) {
        try {
            List<BonusActRequest.AutomationTaskDTO> tasks = new ArrayList<>();

            int employeeCount = Integer.parseInt(requestDTO.getFormData().getEmployeeCount());
            double bonusPercentage = Double.parseDouble(requestDTO.getFormData().getBonusPercentage());
            String financialYear = requestDTO.getFormData().getFinancialYear();

            // 1. Applicability Check
            if (employeeCount < MINIMUM_EMPLOYEE_COUNT) {
                tasks.add(createTask("APPLICABILITY_FAILED",
                        "Bonus Act requires minimum 20 employees. Current: " + employeeCount,
                        "CRITICAL"));
                requestDTO.setStatus("NOT_APPLICABLE");
            } else {
                tasks.add(createTask("VERIFY_APPLICABILITY",
                        "Verify employee count (" + employeeCount + ") and salary limits (≤₹21,000).",
                        "HIGH"));

                // 2. Employee Eligibility Validation
                tasks.add(createTask("VALIDATE_EMPLOYEE_ELIGIBILITY",
                        "Filter eligible employees (salary ≤ ₹21,000) and validate working days.",
                        "CRITICAL"));

                // 3. Bonus Percentage Validation
                if (bonusPercentage < MINIMUM_BONUS_PERCENTAGE || bonusPercentage > MAXIMUM_BONUS_PERCENTAGE) {
                    tasks.add(createTask("BONUS_PERCENTAGE_ERROR",
                            "Bonus percentage must be between 8.33% and 20%. Current: " + bonusPercentage + "%",
                            "CRITICAL"));
                } else {
                    tasks.add(createTask("VALIDATE_BONUS_PERCENTAGE",
                            "Verify bonus percentage (" + bonusPercentage + "%) is within statutory limits.",
                            "HIGH"));
                }

                // 4. Allocable Surplus Calculation
                tasks.add(createTask("CALCULATE_ALLOCABLE_SURPLUS",
                        "Calculate allocable surplus from P&L for FY " + financialYear + ".",
                        "CRITICAL"));

                // 5. Bonus Amount Calculation
                tasks.add(createTask("CALCULATE_BONUS_AMOUNTS",
                        "Calculate individual bonus amounts based on Basic + DA and working days.",
                        "CRITICAL"));

                // 6. Statutory Registers Preparation
                tasks.add(createTask("PREPARE_REGISTER_A",
                        "Generate Register A - Allocable Surplus calculation.",
                        "HIGH"));

                tasks.add(createTask("PREPARE_REGISTER_B",
                        "Generate Register B - Set-on and Set-off details.",
                        "HIGH"));

                tasks.add(createTask("PREPARE_REGISTER_C",
                        "Generate Register C - Bonus payment details for each employee.",
                        "HIGH"));

                // 7. Payment Compliance Check
                tasks.add(createTask("VERIFY_PAYMENT_TIMELINE",
                        "Verify bonus payment made within statutory deadline (8 months from FY end).",
                        "CRITICAL"));

                tasks.add(createTask("VALIDATE_PAYMENT_PROOF",
                        "Validate payment proofs and employee acknowledgments.",
                        "HIGH"));

                // 8. Record Maintenance
                tasks.add(createTask("STORE_REGISTERS_SECURELY",
                        "Store all statutory registers in cloud for audit readiness.",
                        "NORMAL"));

                tasks.add(createTask("GENERATE_COMPLIANCE_REPORT",
                        "Generate comprehensive compliance report for FY " + financialYear + ".",
                        "HIGH"));

                requestDTO.setStatus("INITIATED");
            }

            requestDTO.setAutomationQueue(tasks);

            String email = requestDTO.getUserEmail();
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // Pricing based on employee count
            double amount = employeeCount >= 50 ? 3999.0 : 2499.0;

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

    private BonusActRequest.AutomationTaskDTO createTask(String taskName, String desc, String priority) {
        BonusActRequest.AutomationTaskDTO t = new BonusActRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        return t;
    }
}



