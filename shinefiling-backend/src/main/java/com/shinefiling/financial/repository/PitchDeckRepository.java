package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.PitchDeckApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PitchDeckRepository extends JpaRepository<PitchDeckApplication, Long> {
    Optional<PitchDeckApplication> findBySubmissionId(String submissionId);

    List<PitchDeckApplication> findByUserId(Long userId);

    List<PitchDeckApplication> findByUserEmail(String email);
}
