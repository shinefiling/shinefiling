package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class SoleProprietorshipRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private ProprietorshipFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ProprietorshipFormData {
        private String tradeName;
        private String natureOfBusiness;

        // Principal Place of Business
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        // Proprietor Details
        private ProprietorDTO proprietor;

        // Document URLs for Business
        private String officeUtilityBillUrl;
        private String officeNocUrl; // if rented
        private String officeDeedUrl; // if owned/rented
    }

    @Data
    public static class ProprietorDTO {
        private String name;
        private String fatherName;
        private String dob; // YYYY-MM-DD
        private String pan;
        private String aadhaar;
        private String email;
        private String phone;
        private String address;

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
