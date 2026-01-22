package com.shinefiling.certifications.dto;

import lombok.Data;
import java.util.List;

@Data
public class TanPanRegistrationRequest {
    private String submissionId;
    private String userEmail;
    private String plan; // pan_new, tan_new, correction
    private Double amountPaid;
    private String status;
    private TanPanApplicationDTO formData;
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
