package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegalRepository extends JpaRepository<LegalApplication, Long> {
    LegalApplication findBySubmissionId(String submissionId);
}
