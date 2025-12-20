package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class IecRequest {
    private String submissionId;
    private String userEmail;
    private String firmName;
    private String firmPan; // Limit validation in FE/Controller
    private String status;
    private String planType; // PROPRIETOR, PARTNERSHIP, COMPANY

    private IecFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class IecFormData {
        private String entityType; // Proprietorship, LLP, etc.
        private String natureOfConcern; // Manufacturing, Trading, etc.
        private String address;
        private String mobile;

        // Bank Details
        private String bankAccountNo;
        private String bankIfsc;
        private String bankName;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN_CARD, CANCELLED_CHEQUE, ADDRESS_PROOF
        private String filename;
        private String fileUrl;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task; // DGFT_FILING
        private String priority;
        private String description;
    }
}
