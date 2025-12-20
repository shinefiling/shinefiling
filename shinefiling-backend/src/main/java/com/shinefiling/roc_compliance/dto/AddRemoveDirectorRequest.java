package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class AddRemoveDirectorRequest {
    private String submissionId;
    private String userEmail;
    private String actionType; // ADD or REMOVE
    private Double amountPaid;
    private String status;
    private DirectorChangeFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class DirectorChangeFormData {
        private String companyName;
        private String cin;
        private String effectiveDate;

        // For ADD
        private String newDirectorName;
        private String newDirectorDin;
        private String designation;

        // For REMOVE
        private String removeDirectorName;
        private String removeDirectorDin;
        private String reason;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // RESIGNATION_LETTER, BOARD_RESOLUTION, KYC, DIR2, ETC
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
