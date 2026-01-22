package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class DrugLicenseRequest {
    private String submissionId;
    private String userEmail;
    private String businessName; // Medical Store / Distributor Name
    private String state;
    private String licenseType; // RETAIL, WHOLESALE, MANUFACTURING
    private String status;
    private String plan;
    private Double amountPaid;

    private DrugFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class DrugFormData {
        private String entityType; // Proprietorship, Partnership, etc.
        private String premisesAddress;
        private double areaInSqMeters; // Critical for Retail (10) vs Wholesale (15)
        private boolean hasColdStorage; // Refrigerator availability

        // Technical Staff
        private String pharmacistName;
        private String pharmacistRegNo;
        private String pharmacistQualification; // B.Pharm, D.Pharm

        // Categories
        private boolean isAllopathic;
        private boolean isHomeopathic;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PHARMACIST_CERT, RENT_AGREEMENT, BLUEPRINT, FRIDGE_INVOICE
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
