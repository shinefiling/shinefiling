package com.shinefiling.business_reg.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "pvt_ltd_directors")
public class PvtLtdDirector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private PrivateLimitedApplication application;

    private String name;
    private String fatherName;
    private String dob;
    private String panNumber;
    private String aadhaarNumber;
    private String email;
    private String phone;
    private String directorType; // Resident/Foreign
    private String dinNumber;

    private Integer sharesCount;
    private Double shareholdingPercentage;

    // Document URLs
    private String photoUrl;
    private String panUrl;
    private String aadhaarUrl;
    private String addressProofUrl;
    private String signatureUrl;
}
