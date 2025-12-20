package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.FoundersAgreementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FoundersAgreementRepository extends JpaRepository<FoundersAgreementApplication, Long> {
    Optional<FoundersAgreementApplication> findBySubmissionId(String submissionId);

    List<FoundersAgreementApplication> findByUserId(Long userId);

    List<FoundersAgreementApplication> findByUserEmail(String email);
}
