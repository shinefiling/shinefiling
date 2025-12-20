package com.shinefiling.certifications.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.certifications.model.CertificationApplication;
import com.shinefiling.certifications.repository.CertificationRepository;
import com.shinefiling.certifications.service.automation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class CertificationAutomationService {

    private final Logger log = Logger.getLogger(CertificationAutomationService.class.getName());

    @Autowired
    private CertificationRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;

    @Autowired
    private MsmeStrategy msmeStrategy;
    @Autowired
    private IsoStrategy isoStrategy;
    @Autowired
    private StartupIndiaStrategy adminStrategy;
    @Autowired
    private DscStrategy dscStrategy;
    @Autowired
    private BarCodeStrategy barCodeStrategy;
    @Autowired
    private TanPanStrategy tanPanStrategy;

    public void start(String sid, String rawType) {
        log.info("Starting Cert Auto: " + rawType);
        String type = normalize(rawType);

        CertificationApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new CertificationApplication();
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

        run(job.getId(), type, sid);
    }

    @Async
    public void run(Long jobId, String type, String sid) {
        AutomationJob job = jobRepo.findById(jobId).orElse(null);
        if (job == null)
            return;

        try {
            CertificationApplication app = appRepo.findBySubmissionId(sid);
            ICertificationStrategy strategy = getStrategy(type);

            if (strategy == null)
                throw new RuntimeException("NO_STRATEGY: " + type);

            updateJob(job, "VERIFICATION", "Verifying certification requirements...");
            Thread.sleep(1000);
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());
            strategy.validate(app);

            updateJob(job, "DRAFTING", "Generating Application Forms...");
            Thread.sleep(2000);

            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);
            appRepo.save(app);

            updateJob(job, "PACKAGING", "Finalizing Application...");
            app.setPackagePath("/uploads/cert/" + sid + "_Package.zip");
            app.setStatus("READY_FOR_FILING");
            appRepo.save(app);

            updateJob(job, "COMPLETED", "Certification Application Ready");

        } catch (Exception e) {
            e.printStackTrace();
            job.setStatus("FAILED");
            job.setLogs("Err: " + e.getMessage());
            jobRepo.save(job);
        }
    }

    private ICertificationStrategy getStrategy(String type) {
        if (type.contains("MSME") || type.contains("UDYAM"))
            return msmeStrategy;
        if (type.contains("ISO_CERTIFICATION"))
            return isoStrategy;
        if (type.contains("STARTUP_INDIA"))
            return adminStrategy;
        if (type.contains("DIGITAL_SIGNATURE"))
            return dscStrategy;
        if (type.contains("BAR_CODE"))
            return barCodeStrategy;
        if (type.contains("TAN_PAN"))
            return tanPanStrategy;
        return null;
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
