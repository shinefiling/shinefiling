package com.shinefiling.tax.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "tds_returns")
public class TdsReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId;

    private String status;

    private String plan; // salary, non_salary, nri

    // TDS Details
    private String tanNumber;
    private String financialYear; // e.g., "2024-25"
    private String quarter; // Q1, Q2, Q3, Q4
    private String deductorName;

    // Filing Details
    private String ackNumber; // Token Number

    @Lob
    @Column(length = 10000)
    private String tdsDetailsJson; // Store dynamic form data (challans, employees etc) as JSON string

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
        map.put("tanNumber", tanNumber);
        map.put("financialYear", financialYear);
        map.put("quarter", quarter);
        map.put("plan", plan);
        map.put("deductorName", deductorName);
        map.put("detailsJson", tdsDetailsJson);
        return map;
    }
}
