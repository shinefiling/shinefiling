package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;

@Data
public class OnePersonCompanyRegistrationRequest {
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

        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;
        private String ownershipStatus;

        private String authorizedCapital;
        private String paidUpCapital;

        private DirectorDTO director;
        private NomineeDTO nominee;

        // Plan Specifics
        private String bankPreference;
        private String turnoverEstimate;
        private String accountingStartDate;
    }

    @Data
    public static class DirectorDTO {
        private String name;
        private String fatherName;
        private String dob;
        private String pan;
        private String aadhaar;
        private String email;
        private String phone;

        // Doc URLs
        private String photoUrl;
        private String panUrl;
        private String aadhaarUrl;
        private String addressProofUrl;
    }

    @Data
    public static class NomineeDTO {
        private String name;
        private String relationship;
        private String pan;
        private String aadhaar;
        private String dob;

        // Consent Form
        private String consentFormUrl;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id; // key
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
