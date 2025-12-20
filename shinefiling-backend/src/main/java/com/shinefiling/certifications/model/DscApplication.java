package com.shinefiling.certifications.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "dsc_applications")
public class DscApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    private String applicantName;
    private String applicantType; // Individual, Organization
    private String classType; // Class 3
    private String validityYears; // 1, 2, 3
    private String tokenRequired; // Yes, No

    private String mobile;
    private String email;
    private String panNumber;
    private String aadhaarNumber;

    private String gstNumber; // Optional for Org

    private LocalDateTime createdAt = LocalDateTime.now();
    public LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
