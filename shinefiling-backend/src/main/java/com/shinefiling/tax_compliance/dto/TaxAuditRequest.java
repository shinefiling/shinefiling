package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class TaxAuditRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private TaxAuditFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class TaxAuditFormData {
        private String businessName;
        private String pan;
        private String assessmentYear; // e.g., "2024-2025"
        private String taxpayerType; // "Business", "Professional"
        private Double turnoverAmount; // For checking limits
        private String natureOfBusiness;
        private Boolean gstRegistered;

        // Audit Specifics
        private String auditType; // "44AB" generally
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BALANCE_SHEET, P_AND_L, LEDGER, BANK_STMT
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
