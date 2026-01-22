package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class TradeLicenseRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String state;
    private String city;
    private String status;
    private String plan;
    private Double amountPaid;

    private TradeFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class TradeFormData {
        private String entityType; // Proprietor, Firm, etc.
        private String natureOfTrade; // e.g., Eating House, Clinic, Manufacturing
        private String commencementDate;
        private String address;
        private String wardNumber; // Optional, auto-detect if possible
        private Double areaSquareFeet;
        private boolean isRented;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, AADHAAR, ADDR_PROOF, PROPERTY_TAX_RECEIPT, RENT_AGREEMENT, OWNER_NOC
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
