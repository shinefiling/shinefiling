package com.shinefiling.financial.dto;

import lombok.Data;

@Data
public class CmaDataDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String businessName;
    private String loanAmount;
    private String bankName;
    private String turnover;
    private String mobile;
    private String email;
}
