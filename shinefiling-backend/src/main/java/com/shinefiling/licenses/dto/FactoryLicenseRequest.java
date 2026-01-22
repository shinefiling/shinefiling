package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class FactoryLicenseRequest {
    private String submissionId;
    private String userEmail;
    private String factoryName;
    private String state;
    private String status;
    private String plan;
    private Double amountPaid;
    private int numberOfWorkers;
    private boolean usePower; // To check 10 vs 20 rule
    private double installedHorsePower; // For fee calc

    private FactoryFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class FactoryFormData {
        private String occupierName;
        private String managerName;
        private String factoryAddress;
        private String natureOfManufacturing; // Process description
        private String commencementDate;

        // Technical Details
        private double landArea; // sq mtr
        private double builtUpArea; // sq mtr
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // SITE_PLAN, PROCESS_FLOW, POLLUTION_NOC, FIRE_NOC, OCCUPIER_ID
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
