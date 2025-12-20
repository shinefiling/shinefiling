package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class FssaiRegistrationRequest {
    private String submissionId;
    private String userEmail;
    private Double amountPaid;
    private String paymentId;
    private String status;

    private FssaiFormData formData;
    private List<UploadedDocumentDTO> documents;

    @Data
    public static class FssaiFormData {
        private String businessName;
        private String licenseType;
        private int numberOfYears;
        private String constitution;
        private String kindOfBusiness;
        private String foodCategory;

        // Structured Address
        private String addressLine1;
        private String addressLine2;
        private String state;
        private String district;
        private String pincode;

        // Applicant Details
        private String applicantName;
        private String applicantEmail;
        private String applicantPhone;
        private String applicantPan;
        private String applicantAadhaar;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String filename;
        private String fileUrl;
    }
}
