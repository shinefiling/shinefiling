package com.shinefiling.legal.dto;

import lombok.Data;
import java.util.List;

@Data
public class LegalNoticeRequest {
    private String submissionId;
    private String userEmail;
    private String businessName; // Can be sender name if individual
    private String status;
    private String plan;
    private Double amountPaid;

    private LegalNoticeFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class LegalNoticeFormData {
        private String noticeType; // General, Property, Recovery, etc.
        private String senderName;
        private String senderAddress;
        private String receiverName;
        private String receiverAddress;
        private String matterDescription;
        private String claimAmount; // If applicable
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // SUPPORTING_DOC
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
