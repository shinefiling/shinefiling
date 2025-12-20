package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProfessionalTaxRequest {
    private String submissionId;
    private String plan; // basic, standard, premium
    private String userEmail;
    private Double amountPaid;
    private String status;
    private PtFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PtFormData {
        private String businessName;
        private String state; // e.g., "Maharashtra", "Karnataka"
        private String entityType; // "Employer", "Professional"
        private Integer employeeCount;
        private String registrationType; // "EC" (Enrollment), "RC" (Registration), "Both"

        // For Filing (Standard/Premium)
        private String filingPeriod; // "Monthly", "Yearly"
        private Double totalSalaryPayout;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN_CARD, ADDRESS_PROOF, INCORPORATION_CERT, EMPLOYEE_DATA
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


