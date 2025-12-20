package com.shinefiling.certifications.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "iso_applications")
public class IsoApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status; // PENDING, PROCESSING, COMPLETED, REJECTED

    private String businessName;
    private String businessType;
    private String isoStandard; // 9001, 14001, 27001
    private String scopeOfBusiness;
    private String currentCertification; // Yes/No

    private String mobile;
    private String email;
    private String address;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    public LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
