package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.PartnershipApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PartnershipRepository extends JpaRepository<PartnershipApplication, Long> {
    Optional<PartnershipApplication> findByServiceRequestId(String serviceRequestId);
}
