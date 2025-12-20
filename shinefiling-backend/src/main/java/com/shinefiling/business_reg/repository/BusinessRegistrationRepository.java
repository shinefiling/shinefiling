package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessRegistrationRepository extends JpaRepository<BusinessRegistrationApplication, Long> {
    BusinessRegistrationApplication findBySubmissionId(String submissionId);
}
