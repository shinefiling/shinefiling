package com.shinefiling.financial.dto;

import lombok.Data;

@Data
public class CashFlowDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String businessName;
    private String reportingPeriod;
    private String transactionVolume;
    private String mobile;
    private String email;
}
