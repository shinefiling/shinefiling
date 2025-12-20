package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class TrademarkRenewalRequest {
    private String submissionId;
    private String userEmail;
    private String applicationNumber;
    private String status;

    private RenewalFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class RenewalFormData {
        private String currentOwnerName;
        private String expiryDate; // ISO Date String
        private String renewalType; // NORMAL, LATE (WITH SURCHARGE), RESTORATION
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // TM_CERTIFICATE, POA, ID_PROOF
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

