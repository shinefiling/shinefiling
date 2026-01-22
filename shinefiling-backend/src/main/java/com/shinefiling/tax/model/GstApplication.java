package com.shinefiling.tax.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "gst_applications")
public class GstApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status;

    private String plan; // Basic, Standard, Premium

    // Business Details
    private String tradeName;
    private String legalName;
    private String businessType; // Proprietorship, Company, LLP
    private String natureOfBusiness; // Online, Retail, Service
    private String businessAddress;
    private String turnoverEstimate;

    // Auth Details (JSON or separated)
    private String pan;
    private String aadhaar;

    // Standard/Premium
    private String arnNumber;
    private String gstinNumber;
    private String filingStatus; // For premium returns tracking

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

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
    }

    public Map<String, Object> getFormData() {
        Map<String, Object> map = new HashMap<>();
        map.put("tradeName", tradeName);
        map.put("businessType", businessType);
        map.put("pan", pan);
        map.put("gstinNumber", gstinNumber);
        map.put("arnNumber", arnNumber);
        map.put("plan", plan);
        return map;
    }
}
