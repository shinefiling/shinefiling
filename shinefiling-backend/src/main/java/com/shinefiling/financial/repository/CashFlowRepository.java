package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.CashFlowApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CashFlowRepository extends JpaRepository<CashFlowApplication, Long> {
    Optional<CashFlowApplication> findBySubmissionId(String submissionId);

    List<CashFlowApplication> findByUserId(Long userId);

    List<CashFlowApplication> findByUserEmail(String email);
}
