package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.NdaApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NdaRepository extends JpaRepository<NdaApplication, Long> {
    Optional<NdaApplication> findBySubmissionId(String submissionId);

    List<NdaApplication> findByUserId(Long userId);

    List<NdaApplication> findByUserEmail(String email);
}
