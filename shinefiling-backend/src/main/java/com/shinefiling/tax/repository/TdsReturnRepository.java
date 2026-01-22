package com.shinefiling.tax.repository;

import com.shinefiling.tax.model.TdsReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TdsReturnRepository extends JpaRepository<TdsReturn, Long> {
    Optional<TdsReturn> findByServiceRequestId(String serviceRequestId);
}
