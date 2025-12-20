package com.shinefiling.roc_compliance.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Map;

@Entity
@Data
@Table(name = "roc_applications")
public class RocApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String serviceType;
    private String status;
    private String companyAddress;

    @ElementCollection
    @CollectionTable(name = "roc_uploaded_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "roc_generated_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> generatedDrafts; // Renamed from generatedDocuments to match Service

    private String packagePath;
}
