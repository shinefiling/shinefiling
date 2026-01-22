package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "proprietorship_applications")
public class ProprietorshipApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status; // Payment Received, Processing, Completed, etc.

    private String plan; // basic, standard, premium

    // Business Details
    private String businessNameOption1;
    private String businessNameOption2;
    private String businessType; // Trading, Service, Online, Shop
    private String businessAddress;

    // Proprietor Details
    private String proprietorName;
    private String email;
    private String mobile;
    private String panNumber;
    private String aadhaarNumber;

    // Standard/Premium Fields
    private String gstState; // For Shop Act / GST
    private String shopActState;

    // Premium Fields
    private String professionalTaxState;
    private String bankPreference;

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

    // Output Certificates
    private String gstNumber;
    private String udyamNumber;
    private String shopActNumber;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
    }

    public Map<String, Object> getFormData() {
        Map<String, Object> map = new HashMap<>();
        map.put("businessNameOption1", businessNameOption1);
        map.put("businessType", businessType);
        map.put("proprietorName", proprietorName);
        map.put("mobile", mobile);
        map.put("plan", plan);
        return map;
    }
}
