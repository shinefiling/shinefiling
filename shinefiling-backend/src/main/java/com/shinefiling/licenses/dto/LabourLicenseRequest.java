package com.shinefiling.licenses.dto;

import lombok.Data;
import java.util.List;

@Data
public class LabourLicenseRequest {
    private String submissionId;
    private String userEmail;
    private String contractorName; // Client's name usually
    private String state;
    private int numberOfLabourers;
    private String status;

    private LabourFormData formData;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class LabourFormData {
        private String principalEmployerName;
        private String principalEmployerAddress;
        private String natureOfWork;
        private String workStartDate;
        private String workEndDate;
        private String establishmentRegNo; // Shop Act or Factory License No.
        private String workSiteAddress;

        // Critical for Automation / Rejection
        private boolean isContractAgreementAvailable;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, AADHAAR, ADDR_PROOF, EST_REG_CERT, CONTRACT_AGREEMENT, EPF_REG, ESI_REG
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
