package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class PatentRequest {
    private String submissionId;
    private String userEmail;
    private String inventionTitle;
    private String status;
    private String plan;
    private Double amountPaid;

    private PatentFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PatentFormData {
        private String filingType; // PROVISIONAL, COMPLETE
        private String applicantType; // INDIVIDUAL, STARTUP, SMALL_ENTITY, LARGE_ENTITY
        private String requestExamination; // TRUE, FALSE
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // INVENTION_DISCLOSURE, DRAWINGS, POA
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
