package com.shinefiling.tax.repository;

import com.shinefiling.tax.model.GstAnnualReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GstAnnualReturnRepository extends JpaRepository<GstAnnualReturn, Long> {
    Optional<GstAnnualReturn> findByServiceRequestId(String serviceRequestId);
}
