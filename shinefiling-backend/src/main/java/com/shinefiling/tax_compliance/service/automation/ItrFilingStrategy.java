package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ItrFilingStrategy implements ITaxComplianceStrategy {

    private static final Logger logger = LoggerFactory.getLogger(ItrFilingStrategy.class);

    @Override
    public String getServiceType() {
        return "INCOME_TAX_RETURN_ITR_17";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "FORM_16_PART_A_B",
                "FORM_26AS_TRACE",
                "ANNUAL_INFORMATION_STATEMENT_AIS",
                "BANK_STATEMENTS_ALL_ACCOUNTS",
                "CAPITAL_GAINS_SUMMARY",
                "DEDUCTION_PROOFS_80C_ETC");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        logger.info("[ITR] Validating documents for " + app.getSubmissionId());

        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No ITR Documents");

        // Basic check for Salaried vs Business
        // Just enforce 26AS/AIS as it covers everyone
        if (!up.containsKey("FORM_26AS_TRACE") && !up.containsKey("ANNUAL_INFORMATION_STATEMENT_AIS")) {
            throw new RuntimeException("Tax Credit Statement (26AS) or AIS is required to file ITR.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Computation of Income (The most important doc for clients)
        m.put("COMPUTATION_OF_INCOME_DRAFT", "/uploads/tax/" + sid + "/drafts/Computation.pdf");

        // 2. ITR JSON (The actual file to be uploaded to E-Filing Portal)
        m.put("ITR_RETURN_JSON", "/uploads/tax/" + sid + "/json/ITR_Return_Upload.json");

        // 3. Tax Comparison (Old Regime vs New Regime)
        m.put("REGIME_COMPARISON_REPORT", "/uploads/tax/" + sid + "/drafts/Regime_Compare.pdf");

        return m;
    }
}
