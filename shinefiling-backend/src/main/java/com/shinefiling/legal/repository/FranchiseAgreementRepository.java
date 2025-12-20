package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.FranchiseAgreementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FranchiseAgreementRepository extends JpaRepository<FranchiseAgreementApplication, Long> {
    Optional<FranchiseAgreementApplication> findBySubmissionId(String submissionId);

    List<FranchiseAgreementApplication> findByUserId(Long userId);

    List<FranchiseAgreementApplication> findByUserEmail(String email);
}
