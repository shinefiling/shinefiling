package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class IncreaseAuthorizedCapitalRequest {
    private String submissionId;
    private String userEmail;
    private String plan;
    private Double existingCapital;
    private Double newCapital;
    private Double amountPaid; // Professional Fee
    private Double estimatedRocFee; // Govt Fee
    private String status;
    private CapitalIncreaseFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class CapitalIncreaseFormData {
        private String companyName;
        private String cin;
        private String capitalDivision; // e.g. Equity / Preference
        private String meetingDate; // EGM Date
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BOARD_RESOLUTION, SPECIAL_RESOLUTION, ALTERED_MOA, NOTICE_OF_EGM
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
