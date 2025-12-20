package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class GstAnnualReturnStrategy implements ITaxComplianceStrategy {

    private static final Logger logger = LoggerFactory.getLogger(GstAnnualReturnStrategy.class);

    @Override
    public String getServiceType() {
        return "GST_ANNUAL_RETURN_GSTR9";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "ALL_GSTR_1_FILED_RECEIPTS",
                "ALL_GSTR_3B_FILED_RECEIPTS",
                "AUDITED_FINANCIAL_STATEMENTS",
                "GSTR_2A_2B_RECONCILIATION");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        logger.info("[GST Annual] Validating for: " + app.getSubmissionId());

        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Docs Uploaded");

        // Reconciliation and Financials are key for Annual Return
        if (!up.containsKey("AUDITED_FINANCIAL_STATEMENTS")) {
            throw new RuntimeException("Audited Financials are mandatory for GSTR-9/9C.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. GSTR-9 Draft Form (Annual Return Consolidation)
        m.put("GSTR_9_DRAFT_PDF", "/uploads/tax/" + sid + "/drafts/GSTR9_Draft.pdf");

        // 2. GSTR-9C Reconciliation Statement (If applicable aka Scan Report)
        m.put("GSTR_9C_RECONCILIATION_STATEMENT", "/uploads/tax/" + sid + "/drafts/GSTR9C_Recon.pdf");

        // 3. Tax Paid vs Payable Analysis
        m.put("ANNUAL_TAX_ANALYSIS_SHEET", "/uploads/tax/" + sid + "/drafts/Tax_Analysis.xlsx");

        return m;
    }
}
