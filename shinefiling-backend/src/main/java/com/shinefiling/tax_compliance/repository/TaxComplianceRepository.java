package com.shinefiling.tax_compliance.repository;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaxComplianceRepository extends JpaRepository<TaxComplianceApplication, Long> {
    TaxComplianceApplication findBySubmissionId(String submissionId);
}
