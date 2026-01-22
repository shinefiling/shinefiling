package com.shinefiling.business_reg.dto;

import lombok.Data;

@Data
public class ProprietorshipRegistrationRequest {
    private String plan; // basic, standard, premium

    // Business Details
    private String businessNameOption1;
    private String businessNameOption2;
    private String businessType;
    private String businessAddress;

    // Proprietor Details
    private String proprietorName;
    private String email;
    private String mobile;
    private String panNumber;
    private String aadhaarNumber;

    // Standard/Premium
    private String gstState;
    private String shopActState;

    // Premium
    private String professionalTaxState;
    private String bankPreference;
}
