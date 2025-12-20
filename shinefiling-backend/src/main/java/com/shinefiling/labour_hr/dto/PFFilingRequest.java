package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class PFFilingRequest {
    private String submissionId;
    private String userEmail;
    private String pfEstablishmentCode;
    private String status;

    private PFFilingFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PFFilingFormData {
        private String filingMonth; // e.g. "OCTOBER-2025"
        private String employeeCount;
        private String totalWages;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // SAIARY_SHEET, ECR_FILE
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


