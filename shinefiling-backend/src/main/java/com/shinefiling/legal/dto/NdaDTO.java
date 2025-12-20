package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class NdaDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String disclosingParty;
    private String receivingParty;
    private String purpose;
    private String effectiveDate;
    private String mobile;
    private String email;
}
