package com.shinefiling.licenses.repository;

import com.shinefiling.licenses.model.TradeLicenseApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeLicenseRepository extends JpaRepository<TradeLicenseApplication, Long> {
    TradeLicenseApplication findBySubmissionId(String submissionId);

    List<TradeLicenseApplication> findByUserId(Long userId);
}
