package com.shinefiling.labour_hr.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.labour_hr.model.LabourApplication;
import com.shinefiling.labour_hr.repository.LabourRepository;
import com.shinefiling.labour_hr.service.automation.ILabourStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class LabourAutomationService {
    @Autowired
    private LabourRepository appRepo;
    @Autowired
    private ServiceRequestRepository reqRepo;
    @Autowired
    private AutomationJobRepository jobRepo;
    @Autowired
    private List<ILabourStrategy> strategies;

    public void start(String sid, String rawType) {
        String type = normalize(rawType);
        LabourApplication app = appRepo.findBySubmissionId(sid);
        if (app == null)
            app = create(sid, type);

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
        try {
            AutomationJob job = jobRepo.findById(jobId).orElse(null);
            if (job == null)
                return;

            LabourApplication app = appRepo.findBySubmissionId(job.getOrderId());

            ILabourStrategy strategy = strategies.stream()
                    .filter(s -> type.contains(s.getServiceType()))
                    .findFirst().orElse(null);

            if (strategy == null) {
                job.setStatus("FAILED");
                jobRepo.save(job);
                return;
            }

            job.setCurrentStage("VERIFICATION");
            jobRepo.save(job);
            strategy.validate(app);

            job.setCurrentStage("DRAFTING");
            jobRepo.save(job);
            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);

            job.setCurrentStage("PACKAGING");
            jobRepo.save(job);
            app.setPackagePath("/uploads/labour/" + app.getSubmissionId() + "_Pkg.zip");
            app.setStatus("READY_FOR_FILING");

            appRepo.save(app);
            job.setStatus("COMPLETED");
            jobRepo.save(job);
        } catch (Exception e) {
            e.printStackTrace();
            AutomationJob job = jobRepo.findById(jobId).orElse(null);
            if (job != null) {
                job.setStatus("FAILED");
                jobRepo.save(job);
            }
        }
    }

    private LabourApplication create(String sid, String type) {
        LabourApplication app = new LabourApplication();
        app.setSubmissionId(sid);
        app.setServiceType(type);
        app.setStatus("INITIATED");
        app.setGeneratedDrafts(new HashMap<>());
        app.setUploadedDocuments(new HashMap<>());
        return appRepo.save(app);
    }

    private String normalize(String raw) {
        if (raw == null)
            return "";
        return raw.toUpperCase().replace(" ", "_").replaceAll("[^A-Z0-9_]", "");
    }
}
