package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class MinimumWagesRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;

    private MinimumWagesFormData formData;
    private List<EmployeeDataDTO> employees;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class MinimumWagesFormData {
        private String state;
        private String city;
        private String natureOfBusiness; // SHOP, FACTORY, OFFICE, CONTRACTOR, MSME
        private String employeeCount;
        private String zone; // ZONE_A, ZONE_B, ZONE_C (if applicable)
        private String compliancePeriod; // MONTHLY, QUARTERLY, ANNUAL
        private String minimumWageRate; // State-notified rate
        private Boolean hasOvertimeWorkers;
        private Boolean requiresInspectionSupport;
    }

    @Data
    public static class EmployeeDataDTO {
        private String name;
        private String employeeId;
        private String designation;
        private String skillCategory; // UNSKILLED, SEMI_SKILLED, SKILLED, HIGHLY_SKILLED
        private String currentSalary;
        private String basicWage;
        private String daVda; // Dearness Allowance / Variable DA
        private String workingHours;
        private String overtimeHours;
        private Boolean isCompliant; // Salary >= Minimum Wage
        private String shortfallAmount;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // EMPLOYEE_LIST, SALARY_BREAKUP, PAYSLIPS, ATTENDANCE_RECORDS
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


