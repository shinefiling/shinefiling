package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class Section8RegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private Section8FormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class Section8FormData {
        private List<String> proposedNames; // 2-3 options
        private String charitableObjectives; // e.g., Education, Healthcare, Poverty Relief
        private String detailedToObjects; // Detailed description of objectives

        // Registered Office
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        private String authorizedCapital; // No min capital, but usually 1 Lakh+

        // Directors (Min 2)
        private List<DirectorDTO> directors;

        // Document URLs for Company
        private String officeUtilityBillUrl;
        private String officeNocUrl;
        private String officeDeedUrl; // if owned
        private String objectiveDeclarationUrl; // Specific to Section 8
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
        private String type; // e.g. "PAN", "AADHAAR", "UTILITY_BILL", "OBJECTIVE_DECLARATION"
        private String ownerName; // if applicable
        private String filename;
        private String fileUrl;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task; // e.g., LICENSE_APPLICATION, MOA_DRAFTING
        private String priority;
        private String description;
    }
}

