package com.shinefiling.common.repository;

import com.shinefiling.common.model.AutomationWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AutomationWorkflowRepository extends JpaRepository<AutomationWorkflow, Long> {
    List<AutomationWorkflow> findByStatus(String status);
}
