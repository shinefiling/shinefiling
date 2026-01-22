package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ProducerRegistrationRequest {
    private String plan; // Basic, Standard, Premium

    // Company Details
    private String companyNameOption1;
    private String companyNameOption2;
    private String activityType;
    private String registeredAddress;
    private Integer numberOfProducers;

    // Directors
    private List<Map<String, String>> directors;

    // Standard/Premium
    private String bankPreference;
}
