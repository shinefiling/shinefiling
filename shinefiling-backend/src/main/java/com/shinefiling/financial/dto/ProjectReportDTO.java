package com.shinefiling.financial.dto;

import lombok.Data;

@Data
public class ProjectReportDTO {
    private Long id;
    private String submissionId;
    private String status;
    private String projectTitle;
    private String businessSector;
    private String estimatedCost;
    private String purpose;
    private String mobile;
    private String email;
}
