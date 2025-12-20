package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class FssaiRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String businessType; // Proprietor, Pvt Ltd, etc.
    private String businessCategory; // Manufacturer, Trader, Restaurant, etc.
    private Double annualTurnover; // To determine license type
    private int numberOfOutlets;
    private int validityYears; // 1-5
    private String licenseType; // BASIC, STATE, CENTRAL (Auto-determined)
    private String status;

    private FssaiFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class FssaiFormData {
        private String address;
        private String foodCategory; // e.g. Dairy, Bakery
        private boolean isImporterExporter; // Triggers Central License
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, PHOTO, ADDRESS_PROOF, LAYOUT_PLAN, EQUIPMENT_LIST, NOC
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
