package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.ShareholdersAgreementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShareholdersAgreementRepository extends JpaRepository<ShareholdersAgreementApplication, Long> {
    Optional<ShareholdersAgreementApplication> findBySubmissionId(String submissionId);

    List<ShareholdersAgreementApplication> findByUserId(Long userId);

    List<ShareholdersAgreementApplication> findByUserEmail(String email);
}
