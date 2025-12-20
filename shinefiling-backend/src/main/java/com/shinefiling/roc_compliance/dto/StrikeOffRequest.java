package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class StrikeOffRequest {
    private String submissionId;
    private String userEmail;
    private String cin;
    private String companyName;
    private String status;
    private StrikeOffFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class StrikeOffFormData {
        private String reasonForClosure; // e.g., "Not carrying business"
        private String lastBusinessDate;
        private boolean liabilitiesCleared;
        private boolean bankAccountClosed;
        private boolean pendingLitigation;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // BOARD_RESOLUTION, INDEMNITY_BOND_STK3, AFFIDAVIT_STK4, STATEMENT_OF_ACCOUNTS
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
