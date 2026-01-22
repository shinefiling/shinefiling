package com.shinefiling.tax.repository;

import com.shinefiling.tax.model.GstMonthlyReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GstMonthlyReturnRepository extends JpaRepository<GstMonthlyReturn, Long> {
    Optional<GstMonthlyReturn> findByServiceRequestId(String serviceRequestId);
}
