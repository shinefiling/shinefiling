package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.BarCodeApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BarCodeRepository extends JpaRepository<BarCodeApplication, Long> {
    Optional<BarCodeApplication> findBySubmissionId(String submissionId);

    List<BarCodeApplication> findByUserId(Long userId);
}
