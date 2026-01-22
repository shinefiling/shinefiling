package com.shinefiling.business_reg.repository;

import com.shinefiling.business_reg.model.NidhiApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface NidhiRepository extends JpaRepository<NidhiApplication, Long> {
    Optional<NidhiApplication> findByServiceRequestId(String serviceRequestId);
}
