package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.CertificationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<CertificationApplication, Long> {
    CertificationApplication findBySubmissionId(String submissionId);
}
