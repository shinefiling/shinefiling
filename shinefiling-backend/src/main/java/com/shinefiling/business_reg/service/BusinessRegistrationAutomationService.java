package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import com.shinefiling.business_reg.repository.BusinessRegistrationRepository;
import com.shinefiling.business_reg.service.automation.*;
import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.common.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

/**
 * BusinessRegistrationAutomationService
 * 
 * Handles strict, full-lifecycle automation for:
 * 1. Private Limited Company
 * 2. OPC
 * 3. LLP
 * 4. Partnership
 * 5. Sole Proprietorship
 * 6. Section 8 NGO
 * 7. Nidhi Company
 * 8. Producer Company
 * 9. Public Limited Company
 * 
 * Flow:
 * Start -> Normalize Type -> Find Strategy -> Create Job (INITIATED)
 * -> Verify Documents (VERIFICATION) -> Generate Forms (DRAFTING)
 * -> Package ZIP (PACKAGING) -> Complete
 */
@Service
public class BusinessRegistrationAutomationService {

    private final Logger log = Logger.getLogger(BusinessRegistrationAutomationService.class.getName());

    @Autowired
    private BusinessRegistrationRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;

    // Wire all strategies explicitly or via List injection
    @Autowired
    private PrivateLimitedStrategy pvtStrategy;
    @Autowired
    private OpcStrategy opcStrategy;
    @Autowired
    private LlpStrategy llpStrategy;
    @Autowired
    private PartnershipStrategy partStrategy;
    @Autowired
    private ProprietorshipStrategy propStrategy;
    @Autowired
    private Section8Strategy sec8Strategy;
    @Autowired
    private NidhiStrategy nidhiStrategy;
    @Autowired
    private ProducerStrategy producerStrategy;
    @Autowired
    private PublicLimitedStrategy publicStrategy;

    public AutomationJob startAutomation(String submissionId, String rawType) {
        log.info("Starting Business Automation for: " + submissionId + " / " + rawType);

        String type = normalize(rawType);

        // 1. Ensure Application Exists
        BusinessRegistrationApplication app = appRepo.findBySubmissionId(submissionId);
        if (app == null) {
            app = new BusinessRegistrationApplication();
            app.setSubmissionId(submissionId);
            app.setRegistrationType(type);
            app.setStatus("INITIATED");
            app.setUploadedDocuments(new HashMap<>()); // Prevent Null Pointer later
            app.setGeneratedDrafts(new HashMap<>());
            app = appRepo.save(app);
            log.info("Created new Application record.");
        }

        // 2. Create Job
        AutomationJob job = new AutomationJob();
        job.setOrderId(submissionId);
        job.setType(type);
        job.setCurrentStage("INITIATED");
        job.setStatus("PENDING");
        job = jobRepo.save(job);

        // 3. Run Async
        runJob(job.getId(), type, submissionId);
        return job;
    }

    @Async
    public void runJob(Long jobId, String type, String sid) {
        AutomationJob job = jobRepo.findById(jobId).orElse(null);
        if (job == null)
            return;

        try {
            BusinessRegistrationApplication app = appRepo.findBySubmissionId(sid);
            IBusinessRegistrationStrategy strategy = getStrategy(type);

            if (strategy == null) {
                log.severe("No Strategy found for type: " + type);
                throw new RuntimeException("STRATEGY_NOT_FOUND");
            }

            // === STAGE 1: VERIFICATION ===
            updateJob(job, "VERIFICATION", "Validating Documents...");
            // Simulate processing delay
            Thread.sleep(1500);

            // Check if docs map is null (defensive coding)
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());

            // Execute Strategy Validation
            strategy.validate(app);
            log.info("Validation Passed for " + sid);

            // === STAGE 2: DRAFTING ===
            updateJob(job, "DRAFTING", "Generating Government Forms...");
            Thread.sleep(2000);

            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());

            // Merge new drafts
            app.getGeneratedDrafts().putAll(drafts);

            // Save drafts to DB (Simulated - in real app, these are paths)
            appRepo.save(app);
            log.info("Drafts Generated: " + drafts.keySet());

            // === STAGE 3: PACKAGING ===
            updateJob(job, "PACKAGING", "Zipping Files...");
            Thread.sleep(1000); // Simulate Zip

            String pkgPath = "/uploads/business/" + sid + "/Final_Package_" + System.currentTimeMillis() + ".zip";
            app.setPackagePath(pkgPath);
            app.setStatus("READY_FOR_FILING");
            appRepo.save(app);

            // === COMPLETE ===
            updateJob(job, "COMPLETED", "Automation Finished Successfully");

        } catch (Exception e) {
            log.severe("Automation Failed: " + e.getMessage());
            e.printStackTrace();
            job.setStatus("FAILED");
            job.setLogs("Error: " + e.getMessage());
            jobRepo.save(job);

            // Update App Status too
            BusinessRegistrationApplication app = appRepo.findBySubmissionId(sid);
            if (app != null) {
                app.setStatus("ERROR_IN_AUTOMATION");
                appRepo.save(app);
            }
        }
    }

    private void updateJob(AutomationJob job, String stage, String msg) {
        job.setCurrentStage(stage);
        if ("COMPLETED".equals(stage))
            job.setStatus("COMPLETED");
        job.setLogs((job.getLogs() == null ? "" : job.getLogs() + "\n") + msg);
        jobRepo.save(job);
    }

    private IBusinessRegistrationStrategy getStrategy(String type) {
        // Direct Mapping based on Normalized Strings
        // Note: These strings MUST match what strategies return in
        // getRegistrationType()
        // Or we match strictly by contains/equals

        if (type.contains("PRIVATE_LIMITED"))
            return pvtStrategy;
        if (type.contains("ONE_PERSON") || type.contains("OPC"))
            return opcStrategy;
        if (type.contains("PARTNERSHIP_FIRM"))
            return partStrategy; // Must check before LLP if naming overlaps, but here safe
        if (type.contains("LIMITED_LIABILITY_PARTNERSHIP") || type.contains("LLP"))
            return llpStrategy;
        if (type.contains("SOLE_PROPRIETORSHIP"))
            return propStrategy;
        if (type.contains("SECTION_8"))
            return sec8Strategy;
        if (type.contains("NIDHI"))
            return nidhiStrategy;
        if (type.contains("PRODUCER"))
            return producerStrategy;
        if (type.contains("PUBLIC_LIMITED"))
            return publicStrategy;

        return null; // Should not happen if catalog is synced
    }

    private String normalize(String raw) {
        if (raw == null)
            return "";
        // Example: "Private Limited Company Registration" ->
        // "PRIVATE_LIMITED_COMPANY_REGISTRATION"
        return raw.toUpperCase().trim().replace(" ", "_").replaceAll("[^A-Z0-9_]", "");
    }
}
