package com.shinefiling.certifications.dto;

import lombok.Data;

@Data
public class MsmeApplicationDTO {
    private String applicantName;
    private String aadhaarNumber;
    private String panNumber;
    private String enterpriseName;
    private String organisationType;

    private String plantAddress;
    private String officialAddress;

    private String bankAccountNumber;
    private String ifscCode;

    private String mobileNumber;
    private String email;

    private String dateOfCommencement;
    private String majorActivity;

    private String nicCodes;

    private Integer maleEmployees;
    private Integer femaleEmployees;
    private Integer otherEmployees;

    private Double investmentPlantMachinery;
    private Double investmentEquipment;
    private Double turnover;
}
