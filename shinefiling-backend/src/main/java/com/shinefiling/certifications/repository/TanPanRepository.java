package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.TanPanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TanPanRepository extends JpaRepository<TanPanApplication, Long> {
    Optional<TanPanApplication> findBySubmissionId(String submissionId);

    List<TanPanApplication> findByUserId(Long userId);
}
