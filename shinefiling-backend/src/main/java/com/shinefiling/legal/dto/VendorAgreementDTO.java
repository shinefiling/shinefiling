package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class VendorAgreementDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String vendorName;
    private String companyName;
    private String serviceDescription;
    private String paymentTerms;
    private String mobile;
    private String email;
}
