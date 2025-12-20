package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class DirectorKycRequest {
    private String submissionId;
    private String userEmail;
    private Double amountPaid;
    private String status;
    private KycFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class KycFormData {
        private String din;
        private String fullName;
        private String fathersName;
        private String dob; // YYYY-MM-DD
        private String financialYear;
        private String mobileNumber;
        private String emailId;
        private boolean isForeignNational;

        // Internal
        private boolean otpVerified;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, AADHAAR, PASSPORT, ADDRESS_PROOF
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
