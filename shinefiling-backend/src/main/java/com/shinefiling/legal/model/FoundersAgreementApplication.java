package com.shinefiling.legal.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "founders_agreement_applications")
public class FoundersAgreementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    private String companyName;
    // Store as comma separated or JSON if needed, for simple implementation:
    private String founderNames;
    private String businessDescription;
    private String equitySplit; // e.g., "50:50" or "60:40"
    private String vestingSchedule;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
