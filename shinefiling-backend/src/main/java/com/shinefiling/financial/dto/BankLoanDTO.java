package com.shinefiling.financial.dto;

import lombok.Data;

@Data
public class BankLoanDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String loanType;
    private String amountRequired;
    private String preferredBank;
    private String collateralDetails;
    private String mobile;
    private String email;
}
