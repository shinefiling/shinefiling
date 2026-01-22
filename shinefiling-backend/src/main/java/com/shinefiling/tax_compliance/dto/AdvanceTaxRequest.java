package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdvanceTaxRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private AdvanceTaxFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class AdvanceTaxFormData {
        private String pan;
        private String financialYear; // e.g. "2024-2025"
        private String installment; // "June", "September", "December", "March"
        private String taxpayerType; // "Individual", "Company", "Firm"

        // Income Details
        private Double businessIncome;
        private Double salaryIncome;
        private Double capitalGains;
        private Double interestIncome;
        private Double otherIncome;

        // Deductions
        private Double deduction80C;
        private Double deduction80D;
        private Double otherDeductions;

        private Double estimatedAnnualIncome;
        private Double taxAlreadyPaid; // TDS/TCS
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // INCOME_PROOF, PREVIOUS_ITR, TDS_CERT
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
