package com.shinefiling.financial.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CashFlowDTO {
    private String submissionId;
    private String plan;
    private String userEmail;
    private Double amountPaid;
    private String status;
    private Map<String, Object> formData;
    private List<Map<String, String>> documents;
}
