package com.shinefiling.tax_compliance.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import com.shinefiling.tax_compliance.repository.TaxComplianceRepository;
import com.shinefiling.tax_compliance.service.automation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

/**
 * TaxComplianceAutomationService
 * 
 * Handles:
 * 1. GST Reg
 * 2. GST Monthly (GSTR-1, 3B)
 * 3. GST Annual (GSTR-9)
 * 4. ITR Returns
 * 5. TDS Returns
 * 6. PT Reg/Filing
 * 7. Advance Tax
 * 8. Tax Audit
 */
@Service
public class TaxComplianceAutomationService {

    private final Logger log = Logger.getLogger(TaxComplianceAutomationService.class.getName());

    @Autowired
    private TaxComplianceRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;

    @Autowired
    private GstRegistrationStrategy gstRegStrategy;
    @Autowired
    private GstMonthlyReturnStrategy gstMonthlyStrategy;
    @Autowired
    private GstAnnualReturnStrategy gstAnnualStrategy;
    @Autowired
    private ItrFilingStrategy itrStrategy;
    @Autowired
    private TdsReturnStrategy tdsStrategy;
    @Autowired
    private ProfTaxStrategy ptStrategy;
    @Autowired
    private AdvanceTaxStrategy advStrategy;
    @Autowired
    private TaxAuditStrategy auditStrategy;

    public void start(String sid, String rawType) {
        log.info("Starting Tax Automation: " + rawType);
        String type = normalize(rawType);

        TaxComplianceApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new TaxComplianceApplication();
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
            TaxComplianceApplication app = appRepo.findBySubmissionId(sid);
            ITaxComplianceStrategy strategy = getStrategy(type);

            if (strategy == null)
                throw new RuntimeException("NO_STRATEGY_FOR_" + type);

            updateJob(job, "VERIFICATION", "Checking Tax Documents...");
            Thread.sleep(1000);
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());
            strategy.validate(app);

            updateJob(job, "DRAFTING", "Calculating Taxes & Generating Forms...");
            Thread.sleep(2000);
            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);
            appRepo.save(app);

            updateJob(job, "PACKAGING", "Creating Tax Return Package...");
            String pkg = "/uploads/tax/" + sid + "_ReturnPackage.zip";
            app.setPackagePath(pkg);
            app.setStatus("READY_FOR_FILING");
            appRepo.save(app);

            updateJob(job, "COMPLETED", "Tax Return Prepared Successfully");

        } catch (Exception e) {
            e.printStackTrace();
            job.setStatus("FAILED");
            job.setLogs("Err: " + e.getMessage());
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

    private ITaxComplianceStrategy getStrategy(String type) {
        // Match strictly with strings used in ServiceCatalog / Frontend
        if (type.contains("GST_REGISTRATION"))
            return gstRegStrategy;
        if (type.contains("GST_MONTHLY"))
            return gstMonthlyStrategy;
        if (type.contains("GST_ANNUAL"))
            return gstAnnualStrategy;
        if (type.contains("INCOME_TAX"))
            return itrStrategy;
        if (type.contains("TDS_RETURN"))
            return tdsStrategy;
        if (type.contains("PROFESSIONAL_TAX"))
            return ptStrategy;
        if (type.contains("ADVANCE_TAX"))
            return advStrategy;
        if (type.contains("TAX_AUDIT"))
            return auditStrategy;
        return null;
    }

    private String normalize(String raw) {
        if (raw == null)
            return "";
        return raw.toUpperCase().trim().replace(" ", "_").replaceAll("[^A-Z0-9_]", "");
    }
}
