package com.shinefiling.licenses.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.licenses.model.LicenseApplication;
import com.shinefiling.licenses.repository.LicenseRepository;
import com.shinefiling.licenses.service.automation.ILicenseStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.logging.Logger;

@Service
public class LicenseAutomationService {

    private final Logger log = Logger.getLogger(LicenseAutomationService.class.getName());

    @Autowired
    private LicenseRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;
    @Autowired
    private List<ILicenseStrategy> strategies;

    public void start(String sid, String rawType) {
        String type = normalize(rawType);
        log.info("Starting License Automation: " + sid + " / " + type);

        LicenseApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new LicenseApplication();
            app.setSubmissionId(sid);
            app.setLicenseType(type);
            app.setStatus("INITIATED");
            app.setUploadedDocuments(new HashMap<>());
            app.setGeneratedDocuments(new HashMap<>());
            app = appRepo.save(app);
        }

        AutomationJob job = new AutomationJob();
        job.setOrderId(sid);
        job.setType(type);
        job.setCurrentStage("INITIATED");
        job.setStatus("PENDING");
        job = jobRepo.save(job);

        run(job.getId(), type);
    }

    @Async
    public void run(Long jobId, String type) {
        AutomationJob job = jobRepo.findById(jobId).orElse(null);
        if (job == null)
            return;

        try {
            LicenseApplication app = appRepo.findBySubmissionId(job.getOrderId());
            ILicenseStrategy strategy = strategies.stream()
                    .filter(s -> type.contains(s.getType()))
                    .findFirst().orElse(null);

            if (strategy == null) {
                throw new RuntimeException("No Strategy found for License: " + type);
            }

            // Stage 1: Verification
            updateJob(job, "VERIFICATION", "Verifying license prerequisites...");
            Thread.sleep(1000);
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());
            strategy.validate(app); // Uses refined default or overridden method

            // Stage 2: Drafting
            updateJob(job, "DRAFTING", "Drafting application forms...");
            Thread.sleep(1500);
            Map<String, String> gen = strategy.generate(app);
            if (app.getGeneratedDocuments() == null)
                app.setGeneratedDocuments(new HashMap<>());
            app.getGeneratedDocuments().putAll(gen);
            appRepo.save(app);

            // Stage 3: Packaging
            updateJob(job, "PACKAGING", "Finalizing submission package...");
            app.setPackagePath("/uploads/lic/" + app.getSubmissionId() + "_LicensePkg.zip");
            app.setStatus("READY_FOR_FILING");
            appRepo.save(app);

            updateJob(job, "COMPLETED", "License Application Ready");

        } catch (Exception e) {
            e.printStackTrace();
            job.setStatus("FAILED");
            job.setLogs("Error: " + e.getMessage());
            jobRepo.save(job);
        }
    }

    private void updateJob(AutomationJob job, String stage, String msg) {
        job.setCurrentStage(stage);
        if ("COMPLETED".equals(stage))
            job.setStatus("COMPLETED");
        job.setLogs((job.getLogs() == null ? "" : job.getLogs() + "\n") + msg);
        jobRepo.save(job);
    }

    private String normalize(String raw) {
        if (raw == null)
            return "";
        return raw.toUpperCase().trim().replace(" ", "_").replaceAll("[^A-Z0-9_]", "");
    }
}
