package com.shinefiling.common.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String mobile;

    private String password;

    private String role; // USER, ADMIN, MASTER_ADMIN, SUB_ADMIN, AGENT_ADMIN

    private String status = "Active"; // Default to Active

    private java.time.LocalDateTime createdAt = java.time.LocalDateTime.now();

    private String otp;

    private java.time.LocalDateTime otpExpiry;

    private boolean isVerified = false;

    private String googleId;

    private String loginMethod; // "email", "google"

    // KYC Fields for Agents
    private String kycStatus = "PENDING"; // PENDING, SUBMITTED, VERIFIED, REJECTED
    private String panNumber;
    private String aadhaarNumber;
    @Column(columnDefinition = "TEXT")
    private String kycDocuments; // JSON string of document URLs

    private String profileImage;
}
