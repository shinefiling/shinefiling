package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class TrademarkRequest {
    private String submissionId;
    private String userEmail;
    private String brandName;
    private String applicantType; // INDIVIDUAL, STARTUP, SMALL_ENTERPRISE, OTHERS
    private String plan;
    private Double amountPaid;
    private String status;

    private TrademarkFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class TrademarkFormData {
        private String trademarkType; // WORDMARK, LOGO
        private String classNumber; // Class 1-45
        private String goodsDescription;
        private String ownerName;
        private String ownerAddress;
        private boolean isUseDateClean; // True if "Proposed to be used", False if "Used since..."
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // LOGO_IMAGE, PAN_CARD, UDYAM_REGISTRATION
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
