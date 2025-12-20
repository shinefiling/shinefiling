package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class PFRegistrationRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;

    private PFRegFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PFRegFormData {
        private String businessType; // PVT_LTD, LLP, PROPRIETORSHIP, PARTNERSHIP
        private String employeeCount;
        private String incorporationDate;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, ADDRESS_PROOF, INCORPORATION_CERT
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


