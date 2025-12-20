package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class GstRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private GstFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class GstFormData {
        private String legalName; // As per PAN
        private String tradeName;
        private String businessType; // Proprietor, Partnership, LLP, Company, etc.
        private String natureOfBusiness; // Service, Trading, Manufacturing, Work Contract, etc.
        private String dateOfCommencement;
        private String estimatedTurnover;

        // Principal Place of Business
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;

        // Bank Details (Optional for Basic)
        private String bankAccountNumber;
        private String ifscCode;

        // Document URLs
        private String panUrl;
        private String aadhaarUrl;
        private String photoUrl;
        private String addressProofUrl; // Electricity Bill, Rent Agreement
        private String bankProofUrl; // Cancelled Cheque / Passbook
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // e.g. "PAN", "AADHAAR", "ADDRESS_PROOF", "BANK_PROOF"
        private String filename;
        private String fileUrl;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task; // e.g., GST_REG_01_FILING
        private String priority;
        private String description;
    }
}


