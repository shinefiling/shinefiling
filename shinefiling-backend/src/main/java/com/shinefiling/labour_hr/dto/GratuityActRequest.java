package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class GratuityActRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;

    private GratuityFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class GratuityFormData {
        private String establishmentType; // COMPANY, LLP, FACTORY, SHOP, OTHER
        private String dateOfCommencement;
        private String employeeCount;
        private String state;
        private String labourOfficeJurisdiction;
        private String addressLine1;
        private String addressLine2;
        private String city;
        private String pincode;
        private String employerName;
        private String employerDesignation;
        private Boolean hasFactoryLicense;
        private Boolean hasShopActLicense;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // COI, PAN, ADDRESS_PROOF, FACTORY_LICENSE, SHOP_LICENSE, EMPLOYER_ID
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


