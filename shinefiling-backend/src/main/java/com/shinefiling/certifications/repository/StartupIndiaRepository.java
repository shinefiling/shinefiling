package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.StartupIndiaApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StartupIndiaRepository extends JpaRepository<StartupIndiaApplication, Long> {
    Optional<StartupIndiaApplication> findBySubmissionId(String submissionId);

    List<StartupIndiaApplication> findByUserId(Long userId);
}
