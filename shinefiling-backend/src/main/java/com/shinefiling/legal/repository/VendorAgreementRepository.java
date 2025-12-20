package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.VendorAgreementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VendorAgreementRepository extends JpaRepository<VendorAgreementApplication, Long> {
    Optional<VendorAgreementApplication> findBySubmissionId(String submissionId);

    List<VendorAgreementApplication> findByUserId(Long userId);

    List<VendorAgreementApplication> findByUserEmail(String email);
}
