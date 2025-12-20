package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class GstMonthlyReturnRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private ReturnFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ReturnFormData {
        private String gstin;
        private String tradeName;
        private String filingPeriodMonth; // e.g. "October"
        private String filingPeriodYear; // e.g. "2023"
        private String returnFrequency; // "Monthly", "Quarterly"
        private boolean isNilReturn; // true if no sales/purchases

        // Data URLs (Excel/JSON)
        private String salesDataUrl; // For GSTR-1
        private String purchaseDataUrl; // For ITC (if applicable)

        // Summary (if manually entered)
        private Double totalSales;
        private Double totalPurchases;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // e.g. "SALES_DATA", "PURCHASE_DATA"
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


