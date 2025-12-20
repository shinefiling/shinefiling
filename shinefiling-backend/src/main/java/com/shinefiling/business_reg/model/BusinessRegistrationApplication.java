package com.shinefiling.business_reg.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Map;

@Entity
@Data
@Table(name = "business_reg_applications")
public class BusinessRegistrationApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String registrationType;
    private String status;

    @ElementCollection
    @CollectionTable(name = "business_reg_uploaded_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "business_reg_generated_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> generatedDrafts; // Renamed from generatedDocuments to match Service

    private String packagePath;
}
