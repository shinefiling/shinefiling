package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class PartnershipFirmRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private PartnershipFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PartnershipFormData {
        private String firmName;
        private String natureOfBusiness;

        // Principal Place of Business
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        private String totalCapitalContribution;

        // Partners (Min 2)
        private List<PartnerDTO> partners;

        // Document URLs for Firm
        private String officeUtilityBillUrl;
        private String officeNocUrl; // if rented
        private String officeDeedUrl; // if owned/rented
    }

    @Data
    public static class PartnerDTO {
        private String name;
        private String fatherName;
        private String dob; // YYYY-MM-DD
        private String pan;
        private String aadhaar;
        private String email;
        private String phone;
        private String address;

        private String contributionAmount;
        private String profitSharingRatio;

        // Document URLs
        private String photoUrl;
        private String panUrl;
        private String aadhaarUrl;
        private String addressProofUrl;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // e.g. "PAN", "AADHAAR", "UTILITY_BILL"
        private String ownerName; // if applicable (for partner docs)
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

