package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnnualRocFilingRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private RocFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class RocFormData {
        private String companyName;
        private String cin; // Corporate Identification Number
        private String financialYear; // "2023-2024"
        private String agmDate; // "2024-09-30"
        private String companyType; // "Private Limited", "OPC", "Public Limited"

        // Director & Shareholding
        private Integer numberOfDirectors;
        private Double paidUpCapital;
        private Double turnover;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BALANCE_SHEET, P_AND_L, AUDIT_REPORT, DIRECTOR_REPORT, AGM_MINUTES
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
