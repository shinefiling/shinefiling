package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class RocNoticeReplyRequest {
    private String submissionId;
    private String userEmail;
    private String businessName; // Company Name
    private String status;
    private String plan;
    private Double amountPaid;

    private RocNoticeFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class RocNoticeFormData {
        private String companyName;
        private String cin;
        private String noticeType; // StrikeOff, Director Disqualification, Penalty
        private String noticeDate;
        private String referenceNumber;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // NOTICE_COPY, MOA_AOA, BOARD_RESOLUTION
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
