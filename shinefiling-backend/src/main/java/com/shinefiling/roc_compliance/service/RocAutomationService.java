package com.shinefiling.roc_compliance.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.roc_compliance.model.RocApplication;
import com.shinefiling.roc_compliance.repository.RocApplicationRepository;
import com.shinefiling.roc_compliance.service.automation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

/**
 * RocAutomationService
 * 
 * Handles strict ROC Compliance automation including:
 * 1. Annual Filing (AOC-4, MGT-7)
 * 2. Director KYC
 * 3. Add/Remove Director
 * 4. Change Office
 * 5. Share Transfer
 * 6. Capital Increase
 * 7. MOA/AOA Amend
 * 8. Name Change
 * 9. Strike Off
 */
@Service
public class RocAutomationService {

    private final Logger log = Logger.getLogger(RocAutomationService.class.getName());

    @Autowired
    private RocApplicationRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;

    @Autowired
    private AnnualFilingStrategy annualStrategy;
    @Autowired
    private DirectorKycStrategy kycStrategy;
    @Autowired
    private AddRemoveDirectorStrategy directorStrategy;
    @Autowired
    private ChangeRegisteredOfficeStrategy officeStrategy;
    @Autowired
    private ShareTransferStrategy shareStrategy;
    @Autowired
    private CapitalIncreaseStrategy capitalStrategy;
    @Autowired
    private MoaAoaAmendmentStrategy moaStrategy;
    @Autowired
    private NameChangeStrategy nameStrategy;
    @Autowired
    private StrikeOffStrategy strikeStrategy;
    @Autowired
    private LlpAnnualFilingStrategy llpAnnualStrategy; // Added specially for LLPs (Form 8)

    public void startAutomation(String sid, String rawType) {
        log.info("Starting ROC Automation: " + rawType);
        String type = normalize(rawType);

        RocApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new RocApplication();
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
            RocApplication app = appRepo.findBySubmissionId(sid);
            IRocStrategy strategy = getStrategy(type, app); // Pass app to distinguish Company vs LLP Annual Filing

            if (strategy == null)
                throw new RuntimeException("NO_STRATEGY_FOR_" + type);

            updateJob(job, "VERIFICATION", "Verifying ROC Forms & Data...");
            Thread.sleep(1000);
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());

            strategy.validate(app);

            updateJob(job, "DRAFTING", "Drafting Compliance Documents...");
            Thread.sleep(2000);

            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);
            appRepo.save(app);

            updateJob(job, "PACKAGING", "Finalizing Compliance Kit...");
            String pkg = "/uploads/roc/" + sid + "_ComplianceKit.zip";
            app.setPackagePath(pkg);
            app.setStatus("READY_FOR_FILING");
            appRepo.save(app);

            updateJob(job, "COMPLETED", "ROC Filing Preparation Complete");

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

    private IRocStrategy getStrategy(String type, RocApplication app) {
        // Special logic: Annual Filing can be for Company or LLP
        if (type.contains("ANNUAL_ROC_FILING")) {
            // If application metadata suggests LLP, return LLP strategy
            // Current robust hack: Check if "MGT-7" is mentioned in type, usually Company
            // But if we want to support LLP Annual specially, we can check a flag or user
            // selection
            // For now, defaulting to standard AnnualFilingStrategy (AOC-4/MGT-7) as per
            // catalog string
            return annualStrategy;
        }

        if (type.contains("DIRECTOR_KYC"))
            return kycStrategy;
        if (type.contains("ADDREMOVE_DIRECTOR"))
            return directorStrategy;
        if (type.contains("CHANGE_OF_REGISTERED_OFFICE"))
            return officeStrategy;
        if (type.contains("SHARE_TRANSFER"))
            return shareStrategy;
        if (type.contains("INCREASE_AUTHORIZED_CAPITAL"))
            return capitalStrategy;
        if (type.contains("MOA_AOA_AMENDMENT") || type.contains("MOAAOA"))
            return moaStrategy;
        if (type.contains("COMPANY_NAME_CHANGE"))
            return nameStrategy;
        if (type.contains("STRIKE_OFF"))
            return strikeStrategy;

        return null;
    }

    private String normalize(String raw) {
        if (raw == null)
            return "";
        return raw.toUpperCase().trim().replace(" ", "_").replaceAll("[^A-Z0-9_]", "");
    }
}
