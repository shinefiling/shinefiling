package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class PartnershipDeedDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String firmName;
    private String businessNature;
    private String businessAddress;
    private String partner1Name;
    private String partner1Address;
    private String partner2Name;
    private String partner2Address;
    private Double capitalContribution;
    private String profitSharingRatio;
    private String mobile;
    private String email;
}
