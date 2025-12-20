package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class IncomeTaxReturnRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private ItrFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ItrFormData {
        private String pan;
        private String assessmentYear; // e.g. "2024-2025"
        private String taxpayerType; // "Individual", "HUF", "Firm", "Company"
        private String itrFormType; // "ITR-1", "ITR-2", ... "ITR-7"
        private String sourceOfIncome; // "Salary", "Business", "Capital Gains"
        private String dobOrIncorporationDate;

        // Financials (Optional - mostly from docs)
        private Double grossTotalIncome;
        private Double totalDeductions;
        private Double tdsDeducted;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // FORM_16, BANK_STATEMENT, CAPITAL_GAINS_REPORT
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


