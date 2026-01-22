package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class ShopEstablishmentRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String state;
    private int numberOfEmployees;
    private String status;
    private String plan;
    private Double amountPaid;

    private ShopActFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ShopActFormData {
        private String natureOfBusiness; // Shop, Office, Commercial, etc.
        private String businessAddress;
        private String commencementDate;
        private String ownerName;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, AADHAAR, ADDRESS_PROOF, RENT_AGREEMENT, INCORPORATION_CERT
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
