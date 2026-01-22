package com.shinefiling.business_reg.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class Section8RegistrationRequest {
    private String plan; // Basic, Standard, Premium

    // NGO Details
    private String ngoNameOption1;
    private String ngoNameOption2;
    private String objectives;
    private String registeredAddress;

    // Directors
    private List<Map<String, String>> directors;

    // Standard/Premium
    private String bankPreference;
}
