package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class TrademarkHearingRequest {
    private String submissionId;
    private String userEmail;
    private String applicationNumber;
    private String hearingType; // PHYSICAL, VIDEO_CONFERENCING
    private String plan;
    private Double amountPaid;
    private String status;

    private HearingFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class HearingFormData {
        private String hearingDate; // ISO Date String
        private String hearingTime;
        private String officerName; // Optional
        private String hearingNoticeRefNo;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // HEARING_NOTICE, ADDITIONAL_EVIDENCE, POA
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
