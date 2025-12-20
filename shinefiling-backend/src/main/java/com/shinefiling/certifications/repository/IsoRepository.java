package com.shinefiling.certifications.repository;

import com.shinefiling.certifications.model.IsoApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IsoRepository extends JpaRepository<IsoApplication, Long> {
    Optional<IsoApplication> findBySubmissionId(String submissionId);

    List<IsoApplication> findByUserId(Long userId);
}
