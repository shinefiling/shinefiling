package com.shinefiling.common.repository;

import com.shinefiling.common.model.AutomationJob;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AutomationJobRepository extends JpaRepository<AutomationJob, Long> {

    AutomationJob findTopByOrderIdOrderByIdDesc(String orderId);

    AutomationJob findTopByOrderIdOrderByCreatedAtDesc(String orderId);

    List<AutomationJob> findByStatus(String status);
}
