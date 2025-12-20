package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "ai_prompts")
public class AiPrompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // e.g., "Rent Agreement Generator"

    private String type; // Generation, Classification, Extraction, Chat

    private String version; // v1.0

    private String status; // Active, Inactive, Beta

    @Column(columnDefinition = "TEXT")
    private String systemPrompt;

    private String modelId; // gpt-4, claude-3, etc.

    private Double temperature;

    private Integer maxTokens;

    private Double lastAccuracy; // 0-100

    private Integer usageCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
