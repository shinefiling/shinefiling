package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProducerCompanyRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private ProducerFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ProducerFormData {
        private List<String> proposedNames; // Must end with "Producer Company Limited"

        // Registered Office
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus; // Owned / Rented

        // Business Activity
        private String produceType; // e.g., Dairy, Crops, Fishery
        private String authorizedCapital; // Min 5 Lakh suggested

        // Directors (Min 5)
        private List<DirectorDTO> directors;

        // Members (Min 10 Individuals OR 2 Institutions)
        // For simplicity in form, we might capture count or key representative info
        private Integer numberOfMembers;
        private String memberDetails; // Brief description or list of names

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
        private String farmerProofUrl; // 7/12 Extract, Kissan Card, etc.
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // e.g. "PAN", "AADHAAR", "UTILITY_BILL", "FARMER_PROOF"
        private String ownerName; // if applicable
        private String filename;
        private String fileUrl;
    }

    @Data
    public static class AutomationTaskDTO {
        private String task; // e.g., ELIGIBILITY_CHECK
        private String priority;
        private String description;
    }
}

