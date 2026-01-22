package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.LlpApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LlpRepository extends JpaRepository<LlpApplication, Long> {
    Optional<LlpApplication> findByServiceRequestId(String serviceRequestId);
}
