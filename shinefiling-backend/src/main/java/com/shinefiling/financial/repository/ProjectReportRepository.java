package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.ProjectReportApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectReportRepository extends JpaRepository<ProjectReportApplication, Long> {
    Optional<ProjectReportApplication> findBySubmissionId(String submissionId);

    List<ProjectReportApplication> findByUserId(Long userId);

    List<ProjectReportApplication> findByUserEmail(String email);
}
