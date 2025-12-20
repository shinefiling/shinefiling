package com.shinefiling.ipr.repository;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IprRepository extends JpaRepository<IprApplication, Long> {
    IprApplication findBySubmissionId(String submissionId);
}
