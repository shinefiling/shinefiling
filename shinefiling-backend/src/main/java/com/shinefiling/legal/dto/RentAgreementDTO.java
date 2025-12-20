package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class RentAgreementDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String landlordName;
    private String tenantName;
    private String propertyAddress;
    private String rentAmount;
    private String securityDeposit;
    private String leaseDuration;
    private String mobile;
    private String email;
}
