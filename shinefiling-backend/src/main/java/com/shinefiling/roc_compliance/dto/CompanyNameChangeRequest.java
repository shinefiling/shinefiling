package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class CompanyNameChangeRequest {
    private String submissionId;
    private String userEmail;
    private String cin;
    private String companyName; // Current Name
    private String status;
    private NameChangeFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class NameChangeFormData {
        private String reasonForChange;
        private String proposedName1;
        private String proposedName2;
        private String nameChangeType; // e.g. "VOLUNTARY", "CONVERSION"
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BOARD_RESOLUTION, SPECIAL_RESOLUTION, TRADEMARK_NOC
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
