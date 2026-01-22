package com.shinefiling.legal.dto;

import lombok.Data;
import java.util.List;

@Data
public class LegalNoticeReplyRequest {
    private String submissionId;
    private String userEmail;
    private String businessName; // Can be user name
    private String status;
    private String plan;
    private Double amountPaid;

    private ReplyFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ReplyFormData {
        private String noticeRecievedDate;
        private String senderDetails; // Who sent the notice
        private String caseReferenceNumber;
        private String factsOfCase;
        private String defensePoints;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // RECEIVED_NOTICE_COPY, EVIDENCE
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
