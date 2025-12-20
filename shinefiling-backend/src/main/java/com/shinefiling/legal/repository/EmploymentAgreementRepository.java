package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.EmploymentAgreementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmploymentAgreementRepository extends JpaRepository<EmploymentAgreementApplication, Long> {
    Optional<EmploymentAgreementApplication> findBySubmissionId(String submissionId);

    List<EmploymentAgreementApplication> findByUserId(Long userId);

    List<EmploymentAgreementApplication> findByUserEmail(String email);
}
