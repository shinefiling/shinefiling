package com.shinefiling.tax_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class TaxNoticeReplyRequest {
    private String submissionId;
    private String userEmail;
    private String businessName; // Taxpayer Name
    private String status;
    private String plan;
    private Double amountPaid;

    private TaxNoticeFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class TaxNoticeFormData {
        private String noticeType; // GST, INCOME_TAX, TDS, etc.
        private String noticeSection; // e.g. 143(1), ASMT-10
        private String noticeDate;
        private String referenceNumber;
        private String assessmentYear; // or Financial Year
        private String respondingAuthority;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // NOTICE_COPY, SUPPORTING_EVIDENCE
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
