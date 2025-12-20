package com.shinefiling.licenses.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Data
@Table(name = "fssai_applications")
public class FssaiApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;
    private String licenseType; // BASIC, STATE, CENTRAL
    private String businessName;
    private String fssaiCategory;
    private String applicantName;
    private String mobile;
    private String email;
    private String address;
    private String pincode;
    private String state;
    private String district;

    @ElementCollection
    @CollectionTable(name = "fssai_uploaded_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "fssai_generated_documents", joinColumns = @JoinColumn(name = "application_id"))
    @MapKeyColumn(name = "document_type")
    @Column(name = "document_url")
    private Map<String, String> generatedDocuments;

    private String certificatePath;
    private String fssaiNumber;
    private Double amountPaid;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
