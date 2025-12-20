package com.shinefiling.financial.repository;

import com.shinefiling.financial.model.BusinessValuationApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessValuationRepository extends JpaRepository<BusinessValuationApplication, Long> {
    Optional<BusinessValuationApplication> findBySubmissionId(String submissionId);

    List<BusinessValuationApplication> findByUserId(Long userId);

    List<BusinessValuationApplication> findByUserEmail(String email);
}
