package com.shinefiling.financial.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "pitch_deck_applications")
public class PitchDeckApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    private String startupName;
    private String industry;
    private String fundingStage; // Seed, Series A
    private String targetAudience;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
