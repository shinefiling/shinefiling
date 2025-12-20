package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class DesignRegistrationRequest {
    private String submissionId;
    private String userEmail;
    private String articleName;
    private String status;

    private DesignFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class DesignFormData {
        private String applicantName;
        private String applicantNature; // STARTUP, MSME, OTHER
        private String designDescription;
        private String isNovel; // TRUE, FALSE
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // FRONT_VIEW, BACK_VIEW, SIDE_VIEW, TOP_VIEW, POA
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

