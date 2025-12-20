package com.shinefiling.common.service.automation;

import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import com.shinefiling.business_reg.repository.PrivateLimitedApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AutomationWorkflowService {

    @Autowired
    private PrivateLimitedApplicationRepository appRepository;

    @Autowired
    private AICoreService aiService;

    @Autowired
    private DocumentGenerationService docService;

    public PrivateLimitedApplication runFullAutomation(String submissionId) {
        PrivateLimitedApplication app = appRepository.findBySubmissionId(submissionId);
        if (app == null)
            throw new RuntimeException("Application not found");

        // STEP 6: AI Validation
        Map<String, Object> validationResult = aiService.validateDocuments(app);
        if (!"PASS".equals(validationResult.get("status"))) {
            app.setStatus("DOCUMENTS_REJECTED");
            app.setValidationReport(validationResult.toString());
            return appRepository.save(app);
        }
        app.setStatus("DOCUMENTS_VERIFIED");
        app.setValidationReport(validationResult.toString());
        appRepository.save(app);

        // STEP 7: Auto-Generate Documents
        Map<String, String> generatedDocs = docService.generateAllDocuments(app);
        app.setGeneratedDocuments(generatedDocs);
        app.setStatus("DOCS_GENERATED");
        appRepository.save(app);

        // STEP 8: DSC & DIN (Simulated)
        app.setDscStatus("READY");
        app.setDinStatus("READY");
        appRepository.save(app);

        // STEP 9: Pre-flight QA
        Map<String, Object> qaResult = aiService.performFinalQACheck(app);
        if ("PASS".equals(qaResult.get("status"))) {
            app.setStatus("READY_FOR_PORTAL");
        } else {
            app.setStatus("QA_FAILED");
        }

        // STEP 10: Package Building (Simulated)
        if ("READY_FOR_PORTAL".equals(app.getStatus())) {
            app.setPackagePath("/api/upload/generated/" + app.getSubmissionId() + "_package.zip");
        }

        return appRepository.save(app);
    }
}
