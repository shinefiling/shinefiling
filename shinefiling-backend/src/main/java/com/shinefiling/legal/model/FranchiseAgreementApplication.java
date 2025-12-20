package com.shinefiling.legal.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "franchise_agreement_applications")
public class FranchiseAgreementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    private String franchisorName;
    private String franchiseeName;
    private String franchiseFee;
    private String royalty;
    private String territory;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
