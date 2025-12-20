package com.shinefiling.legal.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "partnership_deed_applications")
public class PartnershipDeedApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    private String firmName;
    private String businessNature;
    private String businessAddress;
    private String partner1Name;
    private String partner1Address;
    private String partner2Name;
    private String partner2Address;
    private Double capitalContribution;
    private String profitSharingRatio;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
