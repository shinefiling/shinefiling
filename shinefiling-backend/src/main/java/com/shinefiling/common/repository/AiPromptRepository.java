package com.shinefiling.common.repository;

import com.shinefiling.common.model.AiPrompt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiPromptRepository extends JpaRepository<AiPrompt, Long> {
    List<AiPrompt> findByStatus(String status);
}
