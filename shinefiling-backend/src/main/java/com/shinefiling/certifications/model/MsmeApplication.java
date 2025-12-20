package com.shinefiling.certifications.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "msme_applications")
public class MsmeApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status; // PENDING, DOCUMENTS_VERIFIED, SUBMITTED_TO_GOVT, COMPLETED, REJECTED

    private Double amountPaid;
    private String paymentId;

    // 1. Basic Info
    private String applicantName; // Name on Aadhaar
    private String aadhaarNumber;

    // 2. Enterprise Details
    private String enterpriseName;
    private String organisationType; // Proprietary, Partnership, etc.
    private String panNumber;

    // 3. Location
    @Column(columnDefinition = "TEXT")
    private String plantAddress;
    @Column(columnDefinition = "TEXT")
    private String officialAddress;

    // 4. Bank & Contact
    private String bankAccountNumber;
    private String ifscCode;
    private String mobileNumber;
    private String email;

    // 5. Business Data
    private String dateOfCommencement;
    private String majorActivity; // MANUFACTURING, SERVICES

    @Column(columnDefinition = "TEXT")
    private String nicCodes; // JSON or Comma Separated

    // 6. Employees & Investment
    private Integer maleEmployees;
    private Integer femaleEmployees;
    private Integer otherEmployees;

    // Investment & Turnover
    private Double investmentPlantMachinery; // Check logic
    private Double turnover;

    // Admin Fields
    private String udyamRegistrationNumber;
    private String certificateUrl;

    private LocalDateTime createdAt = LocalDateTime.now();
    public LocalDateTime updatedAt = LocalDateTime.now(); // Changed to public to allow update

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
