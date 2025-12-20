package com.shinefiling.licenses.repository;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LicenseRepository extends JpaRepository<LicenseApplication, Long> {
    LicenseApplication findBySubmissionId(String submissionId);
}
