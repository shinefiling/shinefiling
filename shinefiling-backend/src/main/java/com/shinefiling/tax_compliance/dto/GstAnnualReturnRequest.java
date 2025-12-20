package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class GstAnnualReturnRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private AnnualReturnFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class AnnualReturnFormData {
        private String gstin;
        private String tradeName;
        private String financialYear; // e.g. "2023-2024"
        private String annualTurnover;
        private boolean isNilReturn;

        // Data URLs (if manual upload needed)
        private String annualSalesUrl;
        private String annualPurchaseUrl;

        // Summary
        private Double totalTaxPaid;
        private Double totalItcClaimed;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type;
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


