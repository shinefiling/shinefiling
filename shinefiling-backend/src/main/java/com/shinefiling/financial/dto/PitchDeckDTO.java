package com.shinefiling.financial.dto;

import lombok.Data;

@Data
public class PitchDeckDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String startupName;
    private String industry;
    private String fundingStage;
    private String targetAudience;
    private String mobile;
    private String email;
}
