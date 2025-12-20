package com.shinefiling.licenses.repository;

import com.shinefiling.licenses.model.FssaiApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FssaiApplicationRepository extends JpaRepository<FssaiApplication, Long> {
    FssaiApplication findBySubmissionId(String submissionId);

    List<FssaiApplication> findByUserId(Long userId);
}
