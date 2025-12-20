package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TaxAuditStrategy implements ITaxComplianceStrategy {

    @Override
    public String getServiceType() {
        return "TAX_AUDIT_FILING";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "FINAL_AUDITED_BALANCE_SHEET",
                "FINAL_AUDITED_PL",
                "TRIAL_BALANCE",
                "STOCK_VALUATION_CERTIFICATE",
                "FORM_26AS_AIS");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Docs");

        if (!up.containsKey("FINAL_AUDITED_BALANCE_SHEET")) {
            throw new RuntimeException("Final Balance Sheet required for Form 3CB/3CD.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Form 3CA / 3CB (Audit Report)
        m.put("FORM_3CA_3CB_AUDIT_REPORT", "/uploads/tax/" + sid + "/drafts/Form3CA_3CB.pdf");

        // 2. Form 3CD (Statement of Particulars - huge XML)
        m.put("FORM_3CD_PARTICULARS_XML", "/uploads/tax/" + sid + "/xml/Form3CD.xml");

        // 3. Tax Audit Annexures
        m.put("TAX_AUDIT_ANNEXURES", "/uploads/tax/" + sid + "/drafts/Annexures.pdf");

        return m;
    }
}
