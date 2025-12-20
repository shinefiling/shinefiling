package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class TrademarkObjectionRequest {
    private String submissionId;
    private String userEmail;
    private String applicationNumber;
    private String objectionType; // SECTION_9 (Absolute), SECTION_11 (Relative/Conflict), FORMALITIES
    private String status;

    private ObjectionFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ObjectionFormData {
        private String examinationReportDate; // Crucial for Deadline
        private String applicantResponse; // User's comments
        private boolean requestHearing; // If they want to request hearing immediately
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // EXAMINATION_REPORT, USAGE_EVIDENCE, POWER_OF_ATTORNEY
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

