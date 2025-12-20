package com.shinefiling.licenses.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Data
@Table(name = "trade_license_applications")
public class TradeLicenseApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;
    private String planType; // BASIC, STANDARD, PREMIUM
    private String businessName;
    private String applicantName;
    private String mobile;
    private String email;
    private String city;
    private String address;
    private String pincode;
    private String state;
    private String district;
    private String businessType;
    private String areaSquareFeet;

    @ElementCollection
    @CollectionTable(name = "trade_license_uploaded_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "trade_license_generated_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> generatedDocuments;

    private String certificatePath;
    private String licenseNumber;
    private Double amountPaid;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
