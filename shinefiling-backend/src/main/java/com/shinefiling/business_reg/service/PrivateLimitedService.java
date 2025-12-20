package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import com.shinefiling.business_reg.repository.PrivateLimitedApplicationRepository;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PrivateLimitedService {

    @Autowired
    private PrivateLimitedApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    public PrivateLimitedApplication createApplication(PrivateLimitedApplication application, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        application.setUser(user);
        if (application.getSubmissionId() == null) {
            application.setSubmissionId("PVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        application.setStatus("SUBMITTED");

        return applicationRepository.save(application);
    }

    public List<PrivateLimitedApplication> getApplicationsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUserId(user.getId());
    }

    public List<PrivateLimitedApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public PrivateLimitedApplication getApplication(String submissionId) {
        return applicationRepository.findBySubmissionId(submissionId);
    }

    public void verifyDocuments(String submissionId) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            app.setStatus("DOCUMENTS_VERIFIED");
            applicationRepository.save(app);
        }
    }

    public void markGovSubmitted(String submissionId, String srn) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            app.setStatus("GOV_SUBMITTED");
            app.setSrn(srn);
            applicationRepository.save(app);
        }
    }

    public void completeApplication(String submissionId, String certificatePath) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            app.setStatus("COMPLETED");
            app.setCertificatePath(certificatePath);
            applicationRepository.save(app);
        }
    }

    public PrivateLimitedApplication updateStatus(String submissionId, String status) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            app.setStatus(status);
            return applicationRepository.save(app);
        }
        return null;
    }

    public void rejectDocument(String submissionId, String docType, String reason) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            if (app.getDocumentRemarks() == null)
                app.setDocumentRemarks(new java.util.HashMap<>());
            if (app.getDocumentStatuses() == null)
                app.setDocumentStatuses(new java.util.HashMap<>());

            app.getDocumentRemarks().put(docType, reason);
            app.getDocumentStatuses().put(docType, "REJECTED");

            // Set status to indicate user action is needed
            app.setStatus("ACTION_REQUIRED");

            applicationRepository.save(app);
        }
    }

    public void acceptDocument(String submissionId, String docType) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            if (app.getDocumentStatuses() == null)
                app.setDocumentStatuses(new java.util.HashMap<>());

            app.getDocumentStatuses().put(docType, "ACCEPTED");
            // Clear remarks if previously rejected
            if (app.getDocumentRemarks() != null) {
                app.getDocumentRemarks().remove(docType);
            }

            applicationRepository.save(app);
        }
    }
}
