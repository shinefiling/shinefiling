package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class LlpRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private LlpFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class LlpFormData {
        private List<String> proposedNames; // 2-3 names
        private String businessActivity;

        // Structured Address
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        private String totalCapitalContribution;

        // Partners (Min 2)
        private List<PartnerDTO> partners;

        // Document URLs for LLP itself
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
        private String dinNumber; // Optional if existing

        private Boolean isDesignatedPartner;
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

