package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrivateLimitedApplicationRepository extends JpaRepository<PrivateLimitedApplication, Long> {
    PrivateLimitedApplication findBySubmissionId(String submissionId);

    List<PrivateLimitedApplication> findByUserId(Long userId);

    void deleteBySubmissionId(String submissionId);
}
