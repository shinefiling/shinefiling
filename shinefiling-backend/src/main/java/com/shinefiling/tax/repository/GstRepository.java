package com.shinefiling.tax.repository;

import com.shinefiling.tax.model.GstApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GstRepository extends JpaRepository<GstApplication, Long> {
    Optional<GstApplication> findByServiceRequestId(String serviceRequestId);
}
