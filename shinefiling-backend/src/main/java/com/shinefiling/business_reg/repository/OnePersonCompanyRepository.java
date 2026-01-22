package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.OnePersonCompanyApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OnePersonCompanyRepository extends JpaRepository<OnePersonCompanyApplication, Long> {
    Optional<OnePersonCompanyApplication> findBySubmissionId(String submissionId);
}
