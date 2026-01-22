package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

import java.util.HashMap;

@Data
@Entity
@Table(name = "llp_applications")
public class LlpApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Use String for order ID to match others if needed, or Long if ServiceRequest
    // ID
    @Column(unique = true)
    private String serviceRequestId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;
    private String plan; // Basic, Standard, Premium

    private LocalDateTime submittedDate;
    private LocalDateTime lastUpdatedDate;

    // LLP Details
    private String llpNameOption1;
    private String llpNameOption2;
    private String businessActivity;
    private String contributionAmount;
    private String registeredAddress;

    // Partners (Stored as JSON String for simplicity)
    @Column(columnDefinition = "TEXT")
    private String partnersJson;

    // Premium/Standard Plan Specifics
    private String profitSharingRatio;
    private String gstState;
    private String bankPreference;
    private String accountingStartDate;
    private String turnoverEstimate;

    // Documents
    @ElementCollection
    @CollectionTable(name = "llp_uploaded_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> uploadedDocuments = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "llp_generated_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> generatedDocuments = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "llp_document_statuses", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "status")
    private Map<String, String> documentStatuses = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "llp_document_remarks", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "remark")
    private Map<String, String> documentRemarks = new HashMap<>();

    // Automation
    @ElementCollection
    @CollectionTable(name = "llp_automation_tasks", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "task_name")
    @Column(name = "completed")
    private Map<String, Boolean> automationTasks = new HashMap<>();

    private String srn;
    private String certificatePath;

    @PrePersist
    protected void onCreate() {
        submittedDate = LocalDateTime.now();
        lastUpdatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdatedDate = LocalDateTime.now();
    }

    // Helper for Admin Dashboard
    public Map<String, Object> getFormData() {
        Map<String, Object> map = new HashMap<>();
        map.put("llpNameOption1", llpNameOption1);
        map.put("businessActivity", businessActivity);
        map.put("contributionAmount", contributionAmount);
        map.put("partnersJson", partnersJson);
        return map;
    }

    // API compatibility methods
    public String getSubmissionId() {
        return serviceRequestId;
    }

    public LocalDateTime getCreatedAt() {
        return submittedDate;
    }

    public Map<String, String> getDocumentStatuses() {
        return documentStatuses;
    }

    public Map<String, String> getDocumentRemarks() {
        return documentRemarks;
    }

    public String getSrn() {
        return srn;
    }

    public String getPlanType() {
        return plan;
    }
}
