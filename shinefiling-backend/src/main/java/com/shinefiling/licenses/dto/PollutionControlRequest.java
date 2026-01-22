package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class PollutionControlRequest {
    private String submissionId;
    private String userEmail;
    private String industryName;
    private String state;
    private String businessCategory; // RED, ORANGE, GREEN, WHITE
    private String certificateType; // CTE (Establish), CTO (Operate)
    private String status;
    private String plan;
    private Double amountPaid;

    private PollutionFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class PollutionFormData {
        private String industryActivity; // e.g., Chemical, Food, etc.
        private String address;
        private double investmentAmount; // In Crores (determines fee usually)
        private double dailyWaterConsumption; // KLD
        private double dailyEffluentDischarge; // KLD

        // Enviro Details
        private boolean hasEtpStp; // Effluent/Sewage Treatment Plant
        private boolean hasAirPollutionControl; // Chimneys, Scrubbers
        private boolean generatesHazardousWaste;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // SITE_PLAN, PROCESS_FLOW, ETP_DESIGN
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
