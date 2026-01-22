package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class PartnershipRegistrationRequest {
    private String plan; // basic, standard, premium

    // Firm Details
    private String firmNameOption1;
    private String firmNameOption2;
    private String businessActivity;
    private String registeredAddress;
    private String capitalContribution;
    private String profitSharingRatio;

    // Standard+
    private String stateOfRegistration;
    private String placeOfBusiness;
    private String dateOfCommencement;

    // Premium+
    private String expectedTurnover;
    private String gstState;
    private String bankPreference;
    private String accountingStartDate;

    // List of Partners
    private List<Map<String, String>> partners;
    // Each map contains: name, email, mobile, pan, aadhaar

    // Not strictly part of incoming JSON body as files come via multipart,
    // but useful for mapping if needed. This DTO mainly handles the "data" part of
    // FormData.
}
