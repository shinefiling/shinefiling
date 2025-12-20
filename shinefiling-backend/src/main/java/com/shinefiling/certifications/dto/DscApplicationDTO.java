package com.shinefiling.certifications.dto;

import lombok.Data;

@Data
public class DscApplicationDTO {
    private String applicantName;
    private String applicantType;
    private String classType;
    private String validityYears;
    private String tokenRequired;
    private String mobile;
    private String email;
    private String panNumber;
    private String aadhaarNumber;
    private String gstNumber;
}
