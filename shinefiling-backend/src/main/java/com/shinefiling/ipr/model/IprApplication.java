package com.shinefiling.ipr.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Map;

@Entity
@Data
@Table(name = "ipr_applications")
public class IprApplication {
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
    @CollectionTable(name = "ipr_uploaded_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> uploadedDocuments;

    @ElementCollection
    @CollectionTable(name = "ipr_generated_docs", joinColumns = @JoinColumn(name = "app_id"))
    @MapKeyColumn(name = "doc_name")
    @Column(name = "url")
    private Map<String, String> generatedDrafts;

    private String packagePath;
}
