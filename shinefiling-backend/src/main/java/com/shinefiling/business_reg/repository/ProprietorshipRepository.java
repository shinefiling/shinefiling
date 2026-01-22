package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.ProprietorshipApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProprietorshipRepository extends JpaRepository<ProprietorshipApplication, Long> {
    Optional<ProprietorshipApplication> findByServiceRequestId(String serviceRequestId);
}
