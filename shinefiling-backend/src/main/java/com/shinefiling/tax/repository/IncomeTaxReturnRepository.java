package com.shinefiling.tax.repository;

import com.shinefiling.tax.model.IncomeTaxReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IncomeTaxReturnRepository extends JpaRepository<IncomeTaxReturn, Long> {
    Optional<IncomeTaxReturn> findByServiceRequestId(String serviceRequestId);
}
