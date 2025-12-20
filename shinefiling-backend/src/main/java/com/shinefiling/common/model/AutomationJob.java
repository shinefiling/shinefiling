package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "automation_jobs")
public class AutomationJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id")
    private String orderId; // Supports both numeric (ServiceRequest) and Alphanumeric (PvtLtd) IDs

    private String type; // e.g., "PRIVATE_LIMITED_REGISTRATION"

    private String currentStage; // generate_docs, fill_forms, etc.

    private String status; // PENDING, IN_PROGRESS, COMPLETED, FAILED, WAITING_FOR_MANUAL

    private Integer attempts = 0;

    @Column(columnDefinition = "TEXT")
    private String lastError;

    @Column(columnDefinition = "TEXT")
    private String logs; // Added field for logging steps

    @Column(columnDefinition = "TEXT")
    private String stagesJson; // JSON list of stages

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
