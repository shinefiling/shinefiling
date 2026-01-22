package com.shinefiling.labour_hr.dto;

import lombok.Data;
import java.util.List;

@Data
public class LabourWelfareFundRequest {
    private String submissionId;
    private String userEmail;
    private String businessName;
    private String status;

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    private String plan;
    private Double amountPaid;

    private LWFFormData formData;
    private List<EmployeeDataDTO> employees;
    private List<UploadedDocumentDTO> documents;
    private List<AutomationTaskDTO> automationQueue;

    @Data
    public static class LWFFormData {
        private String state; // TN, MH, KA, AP, TG, GJ, DL, etc.
        private String businessType; // COMPANY, LLP, PARTNERSHIP, PROPRIETORSHIP
        private String employeeCount;
        private String filingType; // REGISTRATION, ANNUAL_FILING, HALF_YEARLY
        private String lwfRegistrationNumber; // If already registered
        private Double employerContribution;
        private Double employeeContribution;
        private Double totalContribution;
    }

    @Data
    public static class EmployeeDataDTO {
        private String name;
        private String salary;
        private String joiningDate;
        private Boolean isEligible;
        private Boolean isExempted;
    }

    @Data
    public static class UploadedDocumentDTO {
        private String id;
        private String type; // PAN, GST_CIN, ADDRESS_PROOF, EMPLOYEE_LIST
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
