package com.shinefiling.tax.dto;

import lombok.Data;
import java.util.Map;

@Data
public class TdsReturnRequest {
    private String plan; // salary, non_salary, nri

    private String tanNumber;
    private String financialYear;
    private String quarter;
    private String deductorName;

    private Map<String, Object> tdsDetails;
}
