package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "public_limited_applications")
public class PublicLimitedApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status;

    private String plan; // Basic, Standard, Premium

    // Company Details
    private String companyNameOption1;
    private String companyNameOption2;
    private String businessActivity;
    private String registeredAddress;
    private String authorizedCapital; // No min paid-up, but authorized usually needed

    // Directors (Min 3)
    @Column(columnDefinition = "TEXT")
    private String directorsJson;

    // Shareholders (Min 7) - For simplicity storing primary ones or count
    private Integer numberOfShareholders;

    // Standard/Premium
    private String bankResolutionStatus;
    private String shareCertificatesStatus;
    private String auditorStatus;

    @ElementCollection
    private Map<String, String> uploadedDocuments = new HashMap<>();

    @ElementCollection
    private Map<String, String> generatedDocuments = new HashMap<>();

    @ElementCollection
    private Map<String, String> documentStatuses = new HashMap<>();

    @ElementCollection
    private Map<String, String> documentRemarks = new HashMap<>();

    // Automation Checklist
    @ElementCollection
    private Map<String, Boolean> automationTasks = new HashMap<>();

    private LocalDateTime submittedDate = LocalDateTime.now();
    private String cin;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
    }

    public Map<String, Object> getFormData() {
        Map<String, Object> map = new HashMap<>();
        map.put("companyNameOption1", companyNameOption1);
        map.put("businessActivity", businessActivity);
        map.put("directorsJson", directorsJson);
        map.put("plan", plan);
        map.put("numberOfShareholders", numberOfShareholders);
        return map;
    }
}
