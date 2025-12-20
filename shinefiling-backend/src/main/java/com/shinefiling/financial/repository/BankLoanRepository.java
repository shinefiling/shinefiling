package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.BankLoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BankLoanRepository extends JpaRepository<BankLoanApplication, Long> {
    Optional<BankLoanApplication> findBySubmissionId(String submissionId);

    List<BankLoanApplication> findByUserId(Long userId);

    List<BankLoanApplication> findByUserEmail(String email);
}
