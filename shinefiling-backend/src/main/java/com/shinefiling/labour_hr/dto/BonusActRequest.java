package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class BonusActRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;

    private BonusFormData formData;
    private List<EmployeeDataDTO> employees;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class BonusFormData {
        private String companyType; // COMPANY, LLP, PARTNERSHIP, FACTORY, SHOP
        private String state;
        private String employeeCount;
        private String financialYear; // e.g., 2023-2024
        private String bonusPercentage; // 8.33 to 20
        private String allocableSurplus;
        private String totalBonusPayable;
        private String paymentMode; // BANK, CASH
        private String paymentDate;
        private Boolean hasMinimum20Employees;
    }

    @Data
    public static class EmployeeDataDTO {
        private String name;
        private String employeeId;
        private String basicSalary;
        private String daAmount;
        private String workingDays;
        private Boolean isEligible; // Salary <= 21000
        private Double bonusAmount;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // EMPLOYEE_LIST, SALARY_SHEET, PL_STATEMENT, PAYMENT_PROOF
        private String filename;
        private String fileUrl;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task;
        private String priority;
        private String description;
    }
}


