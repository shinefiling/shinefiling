package com.shinefiling.licenses.service;

import com.shinefiling.licenses.model.FssaiApplication;
import com.shinefiling.licenses.repository.FssaiApplicationRepository;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class FssaiService {

    @Autowired
    private FssaiApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    public FssaiApplication createApplication(FssaiApplication application, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        application.setUser(user);
        application.setSubmissionId("FSSAI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        application.setStatus("SUBMITTED");

        return applicationRepository.save(application);
    }

    public List<FssaiApplication> getUserApplications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUserId(user.getId());
    }

    public List<FssaiApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public FssaiApplication getApplication(String submissionId) {
        return applicationRepository.findBySubmissionId(submissionId);
    }

    public FssaiApplication updateStatus(String submissionId, String status) {
        FssaiApplication app = getApplication(submissionId);
        if (app != null) {
            app.setStatus(status);
            return applicationRepository.save(app);
        }
        return null;
    }
}
