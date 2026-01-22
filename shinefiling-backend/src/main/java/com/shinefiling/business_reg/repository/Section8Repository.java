package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.Section8Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface Section8Repository extends JpaRepository<Section8Application, Long> {
    Optional<Section8Application> findByServiceRequestId(String serviceRequestId);
}
