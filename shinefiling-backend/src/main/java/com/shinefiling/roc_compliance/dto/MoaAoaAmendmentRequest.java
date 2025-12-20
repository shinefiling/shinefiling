package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class MoaAoaAmendmentRequest {
    private String submissionId;
    private String userEmail;
    private String amendmentType; // "MOA", "AOA", "BOTH"
    private String reasonForAmendment;
    private String status;
    private AmendmentFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class AmendmentFormData {
        private String companyName;
        private String cin;
        private String existingClause;
        private String proposedClause;
        private String meetingDate; // EGM Date
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BOARD_RESOLUTION, SPECIAL_RESOLUTION, ALTERED_DRAFT
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
