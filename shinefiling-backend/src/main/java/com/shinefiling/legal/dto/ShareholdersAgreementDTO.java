package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class ShareholdersAgreementDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String companyName;
    private String shareholderNames;
    private String shareCapitalDetails;
    private String mobile;
    private String email;
}
