package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.CmaDataApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CmaDataRepository extends JpaRepository<CmaDataApplication, Long> {
    Optional<CmaDataApplication> findBySubmissionId(String submissionId);

    List<CmaDataApplication> findByUserId(Long userId);

    List<CmaDataApplication> findByUserEmail(String email);
}
