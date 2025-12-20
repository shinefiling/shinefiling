package com.shinefiling.licenses.service;

import com.shinefiling.licenses.model.TradeLicenseApplication;
import com.shinefiling.licenses.repository.TradeLicenseRepository;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TradeLicenseService {

    @Autowired
    private TradeLicenseRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    public TradeLicenseApplication createApplication(TradeLicenseApplication application, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        application.setUser(user);
        application.setSubmissionId("TL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        application.setStatus("SUBMITTED");

        return applicationRepository.save(application);
    }

    public List<TradeLicenseApplication> getUserApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUserId(user.getId());
    }

    public List<TradeLicenseApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public TradeLicenseApplication getApplication(String submissionId) {
        return applicationRepository.findBySubmissionId(submissionId);
    }

    public TradeLicenseApplication updateStatus(String submissionId, String status) {
        TradeLicenseApplication app = getApplication(submissionId);
        if (app != null) {
            app.setStatus(status);
            return applicationRepository.save(app);
        }
        return null;
    }
}
