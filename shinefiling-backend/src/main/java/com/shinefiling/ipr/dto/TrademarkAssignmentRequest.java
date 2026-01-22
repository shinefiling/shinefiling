package com.shinefiling.ipr.dto;

import lombok.Data;
import java.util.List;

@Data
public class TrademarkAssignmentRequest {
    private String submissionId;
    private String userEmail;
    private String applicationNumber;
    private String status;
    private String plan;
    private Double amountPaid;

    private AssignmentFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class AssignmentFormData {
        private String assignorName;
        private String assigneeName;
        private String assignmentType; // WITH_GOODWILL, WITHOUT_GOODWILL
        private String considerationValue; // Transfer amount
        private String deedDate; // Date of Assignment Deed
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // ASSIGNMENT_DEED, NOC_FROM_ASSIGNOR, POA
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
