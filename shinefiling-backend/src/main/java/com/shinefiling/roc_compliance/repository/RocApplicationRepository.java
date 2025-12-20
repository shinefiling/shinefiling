package com.shinefiling.roc_compliance.repository;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RocApplicationRepository extends JpaRepository<RocApplication, Long> {
    RocApplication findBySubmissionId(String submissionId);
}
