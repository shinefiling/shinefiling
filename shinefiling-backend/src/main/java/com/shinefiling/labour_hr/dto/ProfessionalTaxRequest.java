package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfessionalTaxRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;

    private PTFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PTFormData {
        private String serviceType; // REGISTRATION, FILING, BOTH
        private String state; // TN, MH, KA, TG, etc.
        private String businessNature;
        private String employeeCount;
        private String salaryStructure; // BASIC_RANGE
        private String filingFrequency; // MONTHLY, QUARTERLY, ANNUAL
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, ADDRESS_PROOF, BUSINESS_PROOF, EMPLOYEE_LIST, SALARY_SHEET
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


