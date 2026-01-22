package com.shinefiling.tax.dto;

import lombok.Data;

@Data
public class GstMonthlyReturnRequest {
    private String plan; // Nil, Standard, Premium

    // Details
    private String gstin;
    private String filingMonth;
    private String filingYear;

    private boolean isNilReturn;
    private String turnoverAmount;
}
