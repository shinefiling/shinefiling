package com.shinefiling.certifications.dto;

import lombok.Data;
import java.util.List;

@Data
public class DscRegistrationRequest {
    private String submissionId;
    private String userEmail;
    private String plan;
    private Double amountPaid;
    private String status;
    private DscApplicationDTO formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String filename;
        private String fileUrl;
        private String type;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task;
        private String description;
        private String priority;
        private String status;
    }
}
