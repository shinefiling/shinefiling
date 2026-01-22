package com.shinefiling.tax.dto;

import lombok.Data;
import java.util.Map;

@Data
public class IncomeTaxReturnRequest {
    private String plan; // salaried, business, capital_gains

    private String panNumber;
    private String assessmentYear;
    private String applicantName;

    private Map<String, Object> incomeDetails;
}
