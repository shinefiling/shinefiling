package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class TdsReturnRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private TdsFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class TdsFormData {
        private String tan;
        private String financialYear; // e.g. "2024-2025"
        private String quarter; // "Q1", "Q2", "Q3", "Q4"
        private String tdsFormType; // "24Q", "26Q", "27Q", "27EQ"
        private String deductorName;

        // Financials (Optional - summary)
        private Integer numberOfDeductees;
        private Double totalTaxDeposited;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // DEDUCTEE_DETAILS, CHALLAN_RECEIPT, SALARY_SHEET
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


