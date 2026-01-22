package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class BarLiquorRequest {
    private String submissionId;
    private String userEmail;
    private String establishmentName;
    private String state;
    private String licenseType; // RETAIL, BAR, WHOLESALE, BREWERY, EVENT
    private String status;
    private String plan;
    private Double amountPaid;

    private BarLiquorFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class BarLiquorFormData {
        private String address;
        private double distanceFromSchoolOrTemple; // in Meters (Critical for validation)
        private boolean hasPoliceNoc;
        private boolean hasFireNoc;
        private String premisesType; // RENTED / OWNED
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // LIQUOR_LAYOUT, SOLVENCY_CERT, POLICE_CLEARANCE
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
