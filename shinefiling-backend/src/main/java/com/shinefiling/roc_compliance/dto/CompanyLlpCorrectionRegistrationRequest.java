package com.shinefiling.roc_compliance.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CompanyLlpCorrectionRegistrationRequest {
    private String submissionId;
    private String plan;
    private String userEmail;
    private Double amountPaid;
    private String status;
    private Map<String, Object> formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class UploadedDocumentDTO {
        private String id;
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
