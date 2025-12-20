package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class OpcRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private OpcFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class OpcFormData {
        private List<String> companyNames;
        private String businessActivity;

        // Structured Address
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        private String authorizedCapital;
        private String paidUpCapital;

        // Owner (Single Director & Member)
        private OwnerDTO owner;

        // Nominee (Mandatory for OPC)
        private NomineeDTO nominee;
    }

    @Data
    public static class OwnerDTO {
        private String name;
        private String fatherName;
        private String dob; // YYYY-MM-DD
        private String pan;
        private String aadhaar;
        private String email;
        private String phone;
        private String dinNumber;

        // Document URLs
        private String photoUrl;
        private String panUrl;
        private String aadhaarUrl;
        private String addressProofUrl;
        private String utilityBillUrl;
    }

    @Data
    public static class NomineeDTO {
        private String name;
        private String fatherName;
        private String dob;
        private String pan;
        private String aadhaar;
        private String email;
        private String phone;
        private String relationship; // Relationship with Owner

        // Document URLs
        private String panUrl;
        private String aadhaarUrl;
        private String consentFormUrl; // INC-3 Form
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
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

