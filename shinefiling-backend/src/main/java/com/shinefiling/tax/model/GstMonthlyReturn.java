package com.shinefiling.tax.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Data
@Table(name = "gst_monthly_returns")
public class GstMonthlyReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Order ID

    private String status;

    private String plan; // Nil, Standard, Premium

    // Return Details
    private String gstin;
    private String filingMonth; // e.g., "April"
    private String filingYear; // e.g., "2025"

    // Data specifics
    private boolean isNilReturn;

    // Standard/Premium
    private String turnoverAmount;

    // Filing Status
    private String gstr1Status; // Pending, Filed
    private String gstr3bStatus; // Pending, Filed

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
        map.put("period", filingMonth + " " + filingYear);
        map.put("isNilReturn", isNilReturn);
        map.put("ackNumber", ackNumber);
        map.put("plan", plan);
        return map;
    }
}
