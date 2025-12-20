package com.shinefiling.legal.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "vendor_agreement_applications")
public class VendorAgreementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    private String vendorName;
    private String companyName;
    private String serviceDescription;
    private String paymentTerms;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
