package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class AnnualFilingStrategy implements IRocStrategy {

    private static final Logger logger = LoggerFactory.getLogger(AnnualFilingStrategy.class);

    @Override
    public String getServiceType() {
        return "ANNUAL_ROC_FILING_AOC4_MGT7";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "AUDITED_BALANCE_SHEET", "AUDITED_PROFIT_LOSS_ACCOUNT",
                "DIRECTORS_REPORT", "AUDITORS_REPORT",
                "NOTICE_OF_AGM", "MGT_9_EXTRACT", "LIST_OF_SHAREHOLDERS");
    }

    @Override
    public void validate(RocApplication app) {
        logger.info("[ROC Annual] Validating SubID: " + app.getSubmissionId());

        if (app.getUploadedDocuments() == null || app.getUploadedDocuments().isEmpty()) {
            throw new RuntimeException("ROC Filing documents not present.");
        }

        List<String> missing = new ArrayList<>();
        for (String req : getRequiredDocuments()) {
            if (!app.getUploadedDocuments().containsKey(req)) {
                missing.add(req);
            }
        }
        if (!missing.isEmpty())
            throw new RuntimeException("Missing ROC Docs: " + missing);
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> drafts = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Form AOC-4
        drafts.put("FORM_AOC_4_DRAFT", "/uploads/roc/" + sid + "/forms/AOC4_Draft.pdf");

        // 2. Form MGT-7
        drafts.put("FORM_MGT_7_DRAFT", "/uploads/roc/" + sid + "/forms/MGT7_Draft.pdf");

        // 3. UDIN Verification
        drafts.put("UDIN_VERIFICATION", "/uploads/roc/" + sid + "/internal/UDIN_Check.txt");

        return drafts;
    }
}
