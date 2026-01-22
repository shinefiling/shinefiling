package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class GumasthaRequest {
    private String submissionId;
    private String userEmail;
    private String establishmentName;
    private String city; // Determines Municipality
    private String status;
    private String plan;
    private Double amountPaid;

    private GumasthaFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class GumasthaFormData {
        private String ownerName;
        private String establishmentType; // SHOP, COMMERCIAL, RESIDENTIAL_HOTEL
        private String natureOfBusiness; // e.g. Retail, Consulting
        private String address;
        private int numberOfEmployees;

        // Property
        private boolean isRented; // If true -> Need NOC
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // OWNER_PHOTO, AADHAAR_CARD, RENT_AGREEMENT, OWNER_NOC
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
