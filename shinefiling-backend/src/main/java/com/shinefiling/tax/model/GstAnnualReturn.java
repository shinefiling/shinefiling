package com.shinefiling.tax.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "gst_annual_returns")
public class GstAnnualReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status;

    private String plan; // Basic, Standard, Premium (9C)

    // Return Details
    private String gstin;
    private String financialYear; // e.g., "2024-25"

    // Data specifics
    private boolean isNilReturn; // For Basic plan check

    // Status
    private String gstr9Status; // Pending, Prepared, Filed
    private String gstr9cStatus; // NA, Pending, Certified, Filed

    private String ackNumber; // Filing ARN

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
        map.put("gstin", gstin);
        map.put("financialYear", financialYear);
        map.put("plan", plan);
        map.put("isNilReturn", isNilReturn);
        map.put("ackNumber", ackNumber);
        return map;
    }
}
