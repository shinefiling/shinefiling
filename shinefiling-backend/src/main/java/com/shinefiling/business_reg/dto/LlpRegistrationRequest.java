package com.shinefiling.business_reg.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@Data
public class LlpRegistrationRequest {
    private String plan;
    private String llpNameOption1;
    private String llpNameOption2;
    private String businessActivity;
    private String contributionAmount;
    private String registeredAddress;
    private String profitSharingRatio;
    private String turnoverEstimate;
    private String gstState;
    private String bankPreference;
    private String accountingStartDate;
    private List<Map<String, String>> partners;
    private Map<String, MultipartFile> documents;

    // Explicit Getters to avoid Lombok compilation issues
    public String getPlan() {
        return plan;
    }

    public String getLlpNameOption1() {
        return llpNameOption1;
    }

    public String getLlpNameOption2() {
        return llpNameOption2;
    }

    public String getBusinessActivity() {
        return businessActivity;
    }

    public String getContributionAmount() {
        return contributionAmount;
    }

    public String getRegisteredAddress() {
        return registeredAddress;
    }

    public String getProfitSharingRatio() {
        return profitSharingRatio;
    }

    public String getTurnoverEstimate() {
        return turnoverEstimate;
    }

    public String getGstState() {
        return gstState;
    }

    public String getBankPreference() {
        return bankPreference;
    }

    public String getAccountingStartDate() {
        return accountingStartDate;
    }

    public List<Map<String, String>> getPartners() {
        return partners;
    }

    public Map<String, MultipartFile> getDocuments() {
        return documents;
    }
}
