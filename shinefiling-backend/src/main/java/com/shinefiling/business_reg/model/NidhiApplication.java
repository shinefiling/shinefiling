package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "nidhi_applications")
public class NidhiApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status; // Payment Received, Name Reserved, Incorporated, etc.

    private String plan; // Basic, Standard, Premium

    // Nidhi Details
    private String companyNameOption1;
    private String companyNameOption2;
    private String authorizedCapital; // e.g., 5 Lakhs, 10 Lakhs
    private String registeredAddress;

    // Directors (Stored as JSON)
    @Column(columnDefinition = "TEXT")
    private String directorsJson; // Name, PAN, Aadhaar, Mobile, Email

    // Premium Fields
    private String ndh4Status; // "Drafted", "Ready"
    private String loanPolicyStatus; // "Drafted"
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
    private String cin; // Corporate Identification Number

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
    }

    public Map<String, Object> getFormData() {
        Map<String, Object> map = new HashMap<>();
        map.put("companyNameOption1", companyNameOption1);
        map.put("authorizedCapital", authorizedCapital);
        map.put("directorsJson", directorsJson);
        map.put("plan", plan);
        return map;
    }
}
