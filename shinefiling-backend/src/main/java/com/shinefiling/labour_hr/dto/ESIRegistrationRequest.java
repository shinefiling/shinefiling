package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class ESIRegistrationRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;
    private String plan;
    private Double amountPaid;

    private ESIRegFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ESIRegFormData {
        private String businessNature; // MANUFACTURING, SERVICE, SHOP
        private String employeeCount;
        private String commencementDate;
        private String state;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, ADDRESS_PROOF, BUSINESS_PROOF, BANK_DETAILS
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
