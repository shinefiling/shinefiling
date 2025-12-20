package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Data
@Table(name = "private_limited_applications")
public class PrivateLimitedApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long serviceRequestId; // Link to the generic ServiceRequest

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;
    private String planType; // BASIC, STANDARD, PREMIUM

    @ElementCollection
    @CollectionTable(name = "proposed_company_names", joinColumns = @JoinColumn(name = "application_id"))
    @Column(name = "company_name")
    private List<String> proposedNames;

    private String businessActivity;
    private String registeredAddress;
    private String authorizedCapital;
    private String paidUpCapital;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PvtLtdDirector> directors;

    @ElementCollection
    @CollectionTable(name = "pvt_ltd_uploaded_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "pvt_ltd_generated_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> generatedDocuments;

    @ElementCollection
    @CollectionTable(name = "pvt_ltd_document_remarks", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "remark")
    private Map<String, String> documentRemarks;

    @ElementCollection
    @CollectionTable(name = "pvt_ltd_document_statuses", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "status")
    private Map<String, String> documentStatuses;

    private String certificatePath;
    private String srn; // Service Request Number from MCA
    private String packagePath;
    private String validationReport;
    private String dscStatus;
    private String dinStatus;
    private Double amountPaid;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
