package com.shinefiling.certifications.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "startup_india_applications")
public class StartupIndiaApplication {
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
    private String entityType; // Pvt Ltd, LLP, Partnership
    private String dateOfIncorporation;
    private String incorporationNumber; // CIN/LLPIN
    private String industry;
    private String sector;

    // Website, PitchDeck link etc can be added later if needed directly or in notes
    private String website;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    public LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
