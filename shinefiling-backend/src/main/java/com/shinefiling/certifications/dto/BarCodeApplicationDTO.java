package com.shinefiling.certifications.dto;

import lombok.Data;

@Data
public class BarCodeApplicationDTO {
    private String businessName;
    private String brandName;
    private Integer numberOfBarcodes;
    private String productCategory;
    private String turnover;
    private String mobile;
    private String email;
    private String gstNumber;
}
