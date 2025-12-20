package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class FoundersAgreementDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String companyName;
    private String founderNames;
    private String businessDescription;
    private String equitySplit;
    private String vestingSchedule;
    private String mobile;
    private String email;
}
