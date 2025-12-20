package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.FinancialApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FinancialRepository extends JpaRepository<FinancialApplication, Long> {
    FinancialApplication findBySubmissionId(String submissionId);
}
