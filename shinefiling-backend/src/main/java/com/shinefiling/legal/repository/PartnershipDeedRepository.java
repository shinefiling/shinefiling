package com.shinefiling.legal.repository;

import com.shinefiling.legal.model.PartnershipDeedApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PartnershipDeedRepository extends JpaRepository<PartnershipDeedApplication, Long> {
    Optional<PartnershipDeedApplication> findBySubmissionId(String submissionId);

    List<PartnershipDeedApplication> findByUserId(Long userId);

    List<PartnershipDeedApplication> findByUserEmail(String email);
}
