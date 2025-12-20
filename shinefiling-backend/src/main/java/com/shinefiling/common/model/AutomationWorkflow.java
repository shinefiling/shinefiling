package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "automation_workflows")
public class AutomationWorkflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // e.g., "STATUS_CHANGE", "NEW_ORDER"
    private String triggerType;

    // For now detailed steps can be a JSON string or simpler structure.
    @Column(columnDefinition = "TEXT")
    private String steps; // JSON Blob

    private String status = "ACTIVE";

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

}
