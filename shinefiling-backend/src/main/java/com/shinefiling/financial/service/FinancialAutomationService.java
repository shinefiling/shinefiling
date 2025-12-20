package com.shinefiling.financial.service;

import com.shinefiling.common.model.AutomationJob;
import com.shinefiling.common.repository.AutomationJobRepository;
import com.shinefiling.financial.model.FinancialApplication;
import com.shinefiling.financial.repository.FinancialRepository;
import com.shinefiling.financial.service.automation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.logging.Logger;

@Service
public class FinancialAutomationService {

    private final Logger log = Logger.getLogger(FinancialAutomationService.class.getName());

    @Autowired
    private FinancialRepository appRepo;
    @Autowired
    private AutomationJobRepository jobRepo;

    @Autowired
    private CmaDataStrategy cmaStrategy;
    @Autowired
    private ProjectReportStrategy projectStrategy;
    @Autowired
    private BankLoanDocStrategy bankStrategy;
    @Autowired
    private CashFlowStrategy cashFlowStrategy;
    @Autowired
    private PitchDeckStrategy pitchStrategy;
    @Autowired
    private ValuationReportStrategy valuationStrategy;

    public void start(String sid, String rawType) {
        log.info("Starting Financial Auto: " + rawType);
        String type = normalize(rawType);

        FinancialApplication app = appRepo.findBySubmissionId(sid);
        if (app == null) {
            app = new FinancialApplication();
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
            FinancialApplication app = appRepo.findBySubmissionId(sid);
            IFinancialStrategy strategy = getStrategy(type);

            if (strategy == null)
                throw new RuntimeException("NO_STRATEGY: " + type);

            updateJob(job, "VERIFICATION", "Verifying financial data...");
            Thread.sleep(1000);
            if (app.getUploadedDocuments() == null)
                app.setUploadedDocuments(new HashMap<>());
            strategy.validate(app);

            updateJob(job, "DRAFTING", "Preparing financial reports...");
            Thread.sleep(2000);

            Map<String, String> drafts = strategy.generateDrafts(app);
            if (app.getGeneratedDrafts() == null)
                app.setGeneratedDrafts(new HashMap<>());
            app.getGeneratedDrafts().putAll(drafts);
            appRepo.save(app);

            updateJob(job, "PACKAGING", "Finalizing reports...");
            app.setPackagePath("/uploads/fin/" + sid + "_Report.zip");
            app.setStatus("READY_FOR_DELIVERY");
            appRepo.save(app);

            updateJob(job, "COMPLETED", "Financial Service Ready");

        } catch (Exception e) {
            e.printStackTrace();
            job.setStatus("FAILED");
            job.setLogs("Err: " + e.getMessage());
            jobRepo.save(job);
        }
    }

    private IFinancialStrategy getStrategy(String type) {
        if (type.contains("CMA_DATA"))
            return cmaStrategy;
        if (type.contains("PROJECT_REPORT"))
            return projectStrategy;
        if (type.contains("BANK_LOAN"))
            return bankStrategy;
        if (type.contains("CASH_FLOW"))
            return cashFlowStrategy;
        if (type.contains("PITCH_DECK"))
            return pitchStrategy;
        if (type.contains("BUSINESS_VALUATION"))
            return valuationStrategy;
        return null; // Should ideally default or error
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
