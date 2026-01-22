package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.ProducerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProducerRepository extends JpaRepository<ProducerApplication, Long> {
    Optional<ProducerApplication> findByServiceRequestId(String serviceRequestId);
}
