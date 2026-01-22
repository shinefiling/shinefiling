package com.shinefiling.tax.dto;

import lombok.Data;
import java.util.Map;

@Data
public class GstRegistrationRequest {
    private String plan; // Basic, Standard, Premium

    // Business Details
    private String tradeName;
    private String legalName;
    private String businessType;
    private String natureOfBusiness;
    private String businessAddress;
    private String turnoverEstimate;

    // Auth
    private String pan;
    private String aadhaar;

    // Premium
    private String wantsInvoicingSoftware;
}
