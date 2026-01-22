package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class PrivateLimitedRegistrationRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private PvtLtdFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PvtLtdFormData {
        private List<String> companyNames;
        private String businessActivity;

        // Structured Address
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;

        private String ownershipStatus; // Owned / Rented

        private String authorizedCapital; // Renamed from capital
        private String paidUpCapital;

        private String shareholding;
        private String gstOption;
        private String bankSupport;

        private List<DirectorDTO> directors;

        // New Fields
        private String natureOfBusiness;
        private String employeeCount; // Startup
        private String bankPreference; // Growth
        private String turnoverEstimate; // Growth
        private String accountingStartDate; // Growth
        private String trademarkName; // Enterprise
        private String trademarkClass; // Enterprise
        private String auditorPreference; // Enterprise
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
        private String directorType; // Resident/Foreign
        private String dinNumber;

        private Integer sharesCount;
        private Double shareholdingPercentage;

        // Document URLs (if passed here or separately)
        private String photoUrl;
        private String panUrl;
        private String aadhaarUrl;
        private String addressProofUrl;
        private String signatureUrl;
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
