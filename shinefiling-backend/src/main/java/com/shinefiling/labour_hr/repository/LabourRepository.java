package com.shinefiling.labour_hr.repository;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LabourRepository extends JpaRepository<LabourApplication, Long> {
    LabourApplication findBySubmissionId(String submissionId);
}
