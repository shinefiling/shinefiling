package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class CopyrightRequest {
    private String submissionId;
    private String userEmail;
    private String workTitle;
    private String status;
    private String plan;
    private Double amountPaid;

    private CopyrightFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class CopyrightFormData {
        private String workCategory; // LITERARY, ARTISTIC, SOFTWARE, MUSIC, CINEMATOGRAPH
        private String authorName;
        private String publicationStatus; // PUBLISHED, UNPUBLISHED
        private String publicationDate; // Optional
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // WORK_COPY, NOC, ID_PROOF
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
