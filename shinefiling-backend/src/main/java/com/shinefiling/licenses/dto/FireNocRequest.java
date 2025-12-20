package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class FireNocRequest {
    private String submissionId;
    private String userEmail;
    private String buildingName;
    private String state;
    private String requestType; // PROVISIONAL, FINAL, RENEWAL
    private String status;

    private FireFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class FireFormData {
        private String buildingType; // COMMERCIAL, INDUSTRIAL, RESIDENTIAL_APT, HOSPITAL, SCHOOL
        private String address;
        private double heightInMeters; // > 15m is High Rise
        private int numberOfFloors;
        private double plotAreaSqMeters;
        private double accessRoadWidth; // Critical for fire engine access

        // Safety Systems
        private boolean hasExtinguishers;
        private boolean hasHydrants;
        private boolean hasSprinklers;
        private boolean hasFireAlarm;
        private boolean hasEmergencyExits;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BUILDING_PLAN, FIRE_LAYOUT, ELECTRIC_CERT, STRUCTURAL_CERT
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
