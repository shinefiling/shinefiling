package com.shinefiling.tax.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "income_tax_returns")
public class IncomeTaxReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId;

    private String status;

    private String plan; // Salaried, Business, Capital Gains

    // ITR Details
    private String panNumber;
    private String assessmentYear; // e.g., "2025-26"
    private String applicantName;

    // Filing Details
    private String ackNumber; // ITR-V Ack No

    @Lob
    @Column(length = 10000)
    private String incomeDetailsJson; // Store dynamic form data as JSON string

    @ElementCollection
    private Map<String, String> uploadedDocuments = new HashMap<>();

    @ElementCollection
    private Map<String, String> generatedDocuments = new HashMap<>();

    @ElementCollection
    private Map<String, String> documentStatuses = new HashMap<>();

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
        map.put("panNumber", panNumber);
        map.put("assessmentYear", assessmentYear);
        map.put("plan", plan);
        map.put("applicantName", applicantName);
        map.put("detailsJson", incomeDetailsJson);
        return map;
    }
}
