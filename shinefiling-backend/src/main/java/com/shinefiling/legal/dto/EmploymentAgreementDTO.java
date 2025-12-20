package com.shinefiling.legal.dto;

import lombok.Data;

@Data
public class EmploymentAgreementDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String employerName;
    private String employeeName;
    private String designation;
    private String salary;
    private String joiningDate;
    private String probationPeriod;
    private String mobile;
    private String email;
}
