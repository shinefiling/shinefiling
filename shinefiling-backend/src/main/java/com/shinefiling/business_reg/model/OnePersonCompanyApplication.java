package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Data
@Table(name = "one_person_company_applications")
public class OnePersonCompanyApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long serviceRequestId;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;
    private String planType; // BASIC, STANDARD, PREMIUM

    @ElementCollection
    @CollectionTable(name = "opc_proposed_names", joinColumns = @JoinColumn(name = "application_id"))
    @Column(name = "company_name")
    private List<String> proposedNames;

    private String businessActivity;
    private String registeredAddress;
    private String authorizedCapital;
    private String paidUpCapital;

    // Director (Only 1 for OPC)
    private String directorName;
    private String directorEmail;
    private String directorMobile;
    private String directorPan;
    private String directorAadhaar;

    // Nominee Details
    private String nomineeName;
    private String nomineeRelationship;
    private String nomineePan;
    private String nomineeAadhaar;
    private String nomineeEmail;
    private String nomineeMobile;

    // Plan Specifics
    private String gstOption;
    private String bankPreference;
    private String turnoverEstimate;
    private String accountingStartDate;

    // Enterprise/Premium specifics (if any overlapping with Pvt Ltd logic)
    private String msmeRegistration;

    @ElementCollection
    @CollectionTable(name = "opc_uploaded_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "opc_generated_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> generatedDocuments;

    @ElementCollection
    @CollectionTable(name = "opc_document_remarks", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "remark")
    private Map<String, String> documentRemarks;

    @ElementCollection
    @CollectionTable(name = "opc_document_statuses", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "status")
    private Map<String, String> documentStatuses;

    private String certificatePath;
    private String srn;
    private Double amountPaid;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Map<String, Object> getFormData() {
        Map<String, Object> data = new java.util.HashMap<>();
        data.put("companyNames", this.proposedNames);
        data.put("businessActivity", this.businessActivity);
        data.put("registeredAddress", this.registeredAddress);
        data.put("authorizedCapital", this.authorizedCapital);
        data.put("paidUpCapital", this.paidUpCapital);

        Map<String, String> director = new java.util.HashMap<>();
        director.put("name", directorName);
        director.put("email", directorEmail);
        director.put("phone", directorMobile);
        director.put("pan", directorPan);
        director.put("aadhaar", directorAadhaar);
        data.put("director", director);

        Map<String, String> nominee = new java.util.HashMap<>();
        nominee.put("name", nomineeName);
        nominee.put("relationship", nomineeRelationship);
        nominee.put("pan", nomineePan);
        nominee.put("aadhaar", nomineeAadhaar);
        data.put("nominee", nominee);

        data.put("plan", this.planType);
        data.put("bankPreference", this.bankPreference);
        data.put("turnoverEstimate", this.turnoverEstimate);

        return data;
    }
}
