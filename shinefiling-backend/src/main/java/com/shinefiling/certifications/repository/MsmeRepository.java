package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.MsmeApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MsmeRepository extends JpaRepository<MsmeApplication, Long> {
    Optional<MsmeApplication> findBySubmissionId(String submissionId);

    List<MsmeApplication> findByUserId(Long userId);
}
