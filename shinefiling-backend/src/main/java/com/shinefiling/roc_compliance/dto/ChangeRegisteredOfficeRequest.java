package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChangeRegisteredOfficeRequest {
    private String submissionId;
    private String userEmail;
    private String changeType; // SAME_CITY, SAME_ROC, DIFFERENT_ROC, DIFFERENT_STATE
    private Double amountPaid;
    private String status;
    private ChangeAddressFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ChangeAddressFormData {
        private String companyName;
        private String cin;
        private String existingAddress;
        private String newAddress;
        private String city;
        private String state;
        private String pincode;
        private String effectiveDate;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // ADDRESS_PROOF, NOC, BOARD_RESOLUTION, ETC
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
