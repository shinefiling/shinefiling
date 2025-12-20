package com.shinefiling.legal.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.legal.model.LegalApplication;
import com.shinefiling.legal.repository.LegalRepository;
import com.shinefiling.legal.service.automation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class LegalAutomationService {

    private final Logger log = Logger.getLogger(LegalAutomationService.class.getName());

    @Autowired
    private LegalRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;

    @Autowired
    private PartnershipDeedStrategy partStrategy;
    @Autowired
    private FoundersAgreementStrategy founderStrategy;
    @Autowired
    private ShareholdersAgreementStrategy shareStrategy;
    @Autowired
    private EmploymentAgreementStrategy empStrategy;
    @Autowired
    private RentAgreementStrategy rentStrategy;
    @Autowired
    private FranchiseAgreementStrategy franchiseStrategy;
    @Autowired
    private NdaStrategy ndaStrategy;
    @Autowired
    private VendorAgreementStrategy vendorStrategy;

    public void start(String sid, String rawType) {
        log.info("Starting Legal Drafting Auto: " + rawType);
        String type = normalize(rawType);

        LegalApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new LegalApplication();
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
            LegalApplication app = appRepo.findBySubmissionId(sid);
            ILegalStrategy strategy = getStrategy(type);

            if (strategy == null)
                throw new RuntimeException("NO_STRATEGY: " + type);

            updateJob(job, "VERIFICATION", "Verifying inputs for Agreement...");
            Thread.sleep(1000);
            strategy.validate(app);

            updateJob(job, "DRAFTING", "Drafting Legal Agreement...");
            Thread.sleep(2000);

            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);
            appRepo.save(app);

            updateJob(job, "PACKAGING", "Finalizing Document...");
            app.setPackagePath("/uploads/legal/" + sid + "_Draft.zip");
            app.setStatus("COMPLETED"); // Legal drafting is done after draft generally
            appRepo.save(app);

            updateJob(job, "COMPLETED", "Legal Draft Ready");

        } catch (Exception e) {
            e.printStackTrace();
            job.setStatus("FAILED");
            job.setLogs("Err: " + e.getMessage());
            jobRepo.save(job);
        }
    }

    private ILegalStrategy getStrategy(String type) {
        if (type.contains("PARTNERSHIP_DEED"))
            return partStrategy;
        if (type.contains("FOUNDERS_AGREEMENT"))
            return founderStrategy;
        if (type.contains("SHAREHOLDERS_AGREEMENT"))
            return shareStrategy;
        if (type.contains("EMPLOYMENT_AGREEMENT"))
            return empStrategy;
        if (type.contains("RENT_AGREEMENT"))
            return rentStrategy;
        if (type.contains("FRANCHISE_AGREEMENT"))
            return franchiseStrategy;
        if (type.contains("NDA"))
            return ndaStrategy;
        if (type.contains("VENDOR_AGREEMENT"))
            return vendorStrategy;
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
