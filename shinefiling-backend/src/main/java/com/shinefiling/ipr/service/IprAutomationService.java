package com.shinefiling.ipr.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.ipr.model.IprApplication;
import com.shinefiling.ipr.repository.IprRepository;
import com.shinefiling.ipr.service.automation.IIprStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.logging.Logger;

@Service
public class IprAutomationService {

    private final Logger log = Logger.getLogger(IprAutomationService.class.getName());

    @Autowired
    private IprRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;
    @Autowired
    private List<IIprStrategy> strategies;

    public void start(String sid, String rawType) {
        String type = normalize(rawType);
        log.info("Starting IPR Automation: " + sid + " / " + type);

        IprApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new IprApplication();
            app.setSubmissionId(sid);
            app.setServiceType(type);
            app.setStatus("INITIATED");
            app.setUploadedDocuments(new HashMap<>());
            app.setGeneratedDrafts(new HashMap<>());
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
            IprApplication app = appRepo.findBySubmissionId(job.getOrderId());
            IIprStrategy strategy = strategies.stream()
                    .filter(s -> type.contains(s.getServiceType()))
                    .findFirst().orElse(null);

            if (strategy == null) {
                throw new RuntimeException("No Strategy found for IPR Service: " + type);
            }

            // Stage 1: Verification
            updateJob(job, "VERIFICATION", "Verifying IPR documents...");
            Thread.sleep(1000);
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());
            strategy.validate(app);

            // Stage 2: Drafting
            updateJob(job, "DRAFTING", "Drafting legal forms/petitions...");
            Thread.sleep(1500);
            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);
            appRepo.save(app);

            // Stage 3: Packaging
            updateJob(job, "PACKAGING", "Finalizing submission package...");
            app.setPackagePath("/uploads/ipr/" + app.getSubmissionId() + "_Package.zip");
            app.setStatus("READY_FOR_FILING");
            appRepo.save(app);

            updateJob(job, "COMPLETED", "IPR Filing Ready");

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
