package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class ESIFilingRequest {
    private String submissionId;
    private String userEmail;
    private String esicCode;
    private String status;
    private String plan;
    private Double amountPaid;

    private ESIFilingFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ESIFilingFormData {
        private String filingMonth; // e.g. "NOVEMBER-2025"
        private String coveredEmployees; // Count of <=21k salary
        private String totalWages;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // WAGE_SHEET_XLS
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
