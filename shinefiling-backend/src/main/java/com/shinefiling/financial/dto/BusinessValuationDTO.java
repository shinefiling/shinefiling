package com.shinefiling.financial.dto;

import lombok.Data;

@Data
public class BusinessValuationDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String companyName;
    private String valuationPurpose;
    private String assetsValue;
    private String lastTurnover;
    private String mobile;
    private String email;
}
