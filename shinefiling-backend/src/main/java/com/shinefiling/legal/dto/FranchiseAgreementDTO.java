package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class FranchiseAgreementDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String franchisorName;
    private String franchiseeName;
    private String franchiseFee;
    private String royalty;
    private String territory;
    private String mobile;
    private String email;
}
