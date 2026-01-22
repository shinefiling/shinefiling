package com.shinefiling.tax.dto;

import lombok.Data;

@Data
public class GstAnnualReturnRequest {
    private String plan; // basic, standard, premium

    // Details
    private String gstin;
    private String financialYear;

    private boolean isNilReturn;
}
