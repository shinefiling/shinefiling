package com.shinefiling.financial.model;

import com.shinefiling.common.model.User;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "cma_data_applications")
public class CmaDataApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String submissionId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    // Credit Monitoring Arrangement
    private String businessName;
    private String loanAmount;
    private String bankName;
    private String turnover;

    private String mobile;
    private String email;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
