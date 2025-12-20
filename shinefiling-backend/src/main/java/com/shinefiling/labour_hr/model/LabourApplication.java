package com.shinefiling.labour_hr.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Map;

@Entity
@Data
@Table(name = "labour_applications")
public class LabourApplication {
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

    @ElementCollection
    @CollectionTable(name = "labour_uploaded_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "labour_generated_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> generatedDrafts;

    private String packagePath;
}
