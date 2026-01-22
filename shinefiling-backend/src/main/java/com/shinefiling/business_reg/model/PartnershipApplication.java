package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Data
@Table(name = "partnership_applications")
public class PartnershipApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceRequestId; // Generic Order ID

    private String status; // Payment Received, Ready for Filing, Filed, Approved, Completed

    private String plan; // basic, standard, premium

    // Firm Details
    private String firmNameOption1;
    private String firmNameOption2;
    private String businessActivity;
    private String registeredAddress;
    private String capitalContribution; // e.g. "100000"
    private String profitSharingRatio; // e.g. "50:50"

    // Standard/Premium fields
    private String stateOfRegistration;
    private String placeOfBusiness; // District
    private String dateOfCommencement;

    // Premium fields
    private String expectedTurnover;
    private String gstState;
    private String bankPreference;
    private String accountingStartDate;

    @Column(columnDefinition = "TEXT")
    private String partnersJson; // Stores list of partners (Name, Email, Mobile, PAN, Aadhaar)

    @ElementCollection
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    private Map<String, String> generatedDocuments;

    @ElementCollection
    private Map<String, String> documentStatuses; // Verified, Rejected

    @ElementCollection
    private Map<String, String> documentRemarks;

    // Automation Checklist
    @ElementCollection
    private Map<String, Boolean> automationTasks;

    private LocalDateTime submittedDate = LocalDateTime.now();
    private String srn; // Registrar Filing Number if applicable

    public Map<String, Object> getFormData() {
        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("firmNameOption1", firmNameOption1);
        map.put("firmNameOption2", firmNameOption2);
        map.put("businessActivity", businessActivity);
        map.put("registeredAddress", registeredAddress);
        map.put("capitalContribution", capitalContribution);
        map.put("profitSharingRatio", profitSharingRatio);
        map.put("stateOfRegistration", stateOfRegistration);
        map.put("placeOfBusiness", placeOfBusiness);
        map.put("dateOfCommencement", dateOfCommencement);
        map.put("expectedTurnover", expectedTurnover);
        map.put("gstState", gstState);
        map.put("bankPreference", bankPreference);
        map.put("accountingStartDate", accountingStartDate);
        map.put("partnersJson", partnersJson);
        return map;
    }
}
