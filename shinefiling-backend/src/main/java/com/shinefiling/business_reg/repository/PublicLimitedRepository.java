package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.PublicLimitedApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PublicLimitedRepository extends JpaRepository<PublicLimitedApplication, Long> {
    Optional<PublicLimitedApplication> findByServiceRequestId(String serviceRequestId);
}
