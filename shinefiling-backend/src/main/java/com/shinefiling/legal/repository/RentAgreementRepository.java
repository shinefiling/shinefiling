package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.RentAgreementApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RentAgreementRepository extends JpaRepository<RentAgreementApplication, Long> {
    Optional<RentAgreementApplication> findBySubmissionId(String submissionId);

    List<RentAgreementApplication> findByUserId(Long userId);

    List<RentAgreementApplication> findByUserEmail(String email);
}
