package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class LlpAnnualFilingStrategy implements IRocStrategy {
    @Override
    public String getServiceType() {
        return "LLP_ANNUAL_FILING";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("STATEMENT_OF_ACCOUNTS_SOLVENCY", "ANNUAL_RETURN_DETAILS", "DESIGNATED_PARTNER_DSC");
    }

    @Override
    public void validate(RocApplication app) {
        // Validation logic
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("FORM_8_SOLVENCY", "/uploads/roc/" + app.getSubmissionId() + "_Form8.pdf");
        drafts.put("FORM_11_ANNUAL_RETURN", "/uploads/roc/" + app.getSubmissionId() + "_Form11.pdf");
        return drafts;
    }
}
