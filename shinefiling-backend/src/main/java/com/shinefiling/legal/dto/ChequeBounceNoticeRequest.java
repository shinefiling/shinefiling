package com.shinefiling.legal.dto;

import lombok.Data;
import java.util.List;

@Data
public class ChequeBounceNoticeRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;
    private String plan;
    private Double amountPaid;

    private ChequeBounceFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ChequeBounceFormData {
        private String userType; // Complainant (Payee) or Accused (Drawer)
        private String chequeNumber;
        private String chequeDate;
        private String bankName;
        private Double chequeAmount;
        private String bounceDate;
        private String bounceReason;
        private String otherPartyName;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // CHEQUE_COPY, RETURN_MEMO, NOTICE_COPY
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
