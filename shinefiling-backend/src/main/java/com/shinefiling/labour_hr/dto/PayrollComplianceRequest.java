package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class PayrollComplianceRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;
    private String plan;
    private Double amountPaid;

    private PayrollFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PayrollFormData {
        private String employeeCount;
        private String compliancePeriod; // MONTHLY, QUARTERLY, ANNUAL
        private String salaryCycle; // 1st-30th, 25th-24th
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // ATTENDANCE_SHEET, SALARY_STRUCTURE, PREV_MONTH_DATA
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
