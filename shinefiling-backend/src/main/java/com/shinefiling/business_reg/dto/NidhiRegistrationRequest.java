package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class NidhiRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private NidhiFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class NidhiFormData {
        private List<String> proposedNames; // "Nidhi Limited" is mandatory

        // Registered Office
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        // Capital & Business Intent
        private String authorizedCapital; // Min 10 Lakh
        private String depositLoanIntention; // Brief description

        // Directors (Min 3)
        private List<DirectorDTO> directors;

        // Shareholders (Min 7) - note that directors are usually shareholders too
        private Integer numberOfShareholders; // Just to capture intent, detail captured in director/member list usually

        // Document URLs for Company
        private String officeUtilityBillUrl;
        private String officeNocUrl;
        private String officeDeedUrl; // if owned
    }

    @Data
    public static class DirectorDTO {
        private String name;
        private String fatherName;
        private String dob; // YYYY-MM-DD
        private String pan;
        private String aadhaar;
        private String email;
        private String phone;
        private String address;
        private String dinNumber; // Optional

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
        private String ownerName; // if applicable
        private String filename;
        private String fileUrl;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task; // e.g., NDH-4_FILING
        private String priority;
        private String description;
    }
}

