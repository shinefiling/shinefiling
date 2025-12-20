package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.DscApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DscRepository extends JpaRepository<DscApplication, Long> {
    Optional<DscApplication> findBySubmissionId(String submissionId);

    List<DscApplication> findByUserId(Long userId);
}
