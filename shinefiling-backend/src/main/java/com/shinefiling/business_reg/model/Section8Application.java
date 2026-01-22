package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "section8_applications")
public class Section8Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status; // Payment Received, Name Reserved, License Applied (INC-12), Incorporated, etc.

    private String plan; // Basic, Standard, Premium

    // NGO Details
    private String ngoNameOption1;
    private String ngoNameOption2;
    private String objectives; // Education, Health, Charity
    private String registeredAddress;

    // Directors (Stored as JSON)
    @Column(columnDefinition = "TEXT")
    private String directorsJson; // Name, PAN, Aadhaar, Mobile, Email

    // Premium Fields
    private String incomeExpenseProjection; // "Attached"
    private String bankPreference;
    private String ngoDarpanId;
    private String csr1Number;

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
    private String cin; // Corporate Identification Number (After Incorporation)
    private String inc12LicenseNumber;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
    }

    public Map<String, Object> getFormData() {
        Map<String, Object> map = new HashMap<>();
        map.put("ngoNameOption1", ngoNameOption1);
        map.put("objectives", objectives);
        map.put("directorsJson", directorsJson);
        map.put("plan", plan);
        return map;
    }
}
