package com.shinefiling.roc_compliance.dto;

import lombok.Data;
import java.util.List;

@Data
public class ShareTransferRequest {
    private String submissionId;
    private String userEmail;
    private String companyCin;
    private Double considerationAmount;
    private Double stampDutyAmount;
    private String status;
    private ShareTransferFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class ShareTransferFormData {
        private String companyName;
        private String transferDate;
        private Integer numberOfShares;
        private Double pricePerShare;

        // Transferor (Seller)
        private String transferorName;
        private String transferorPan;
        private String transferorFolioNo;

        // Transferee (Buyer)
        private String transfereeName;
        private String transfereePan;
        private String transfereeEmail;
        private String transfereeMobile;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // SH4_DEED, SHARE_CERTIFICATE, STAMP_DUTY_PROOF, BOARD_RESOLUTION
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
