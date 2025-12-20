package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class GstMonthlyReturnStrategy implements ITaxComplianceStrategy {

    private static final Logger logger = LoggerFactory.getLogger(GstMonthlyReturnStrategy.class);

    @Override
    public String getServiceType() {
        return "GST_MONTHLY_RETURN_GSTR1_3B"; // Matches typical normalization
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "SALES_REGISTER_EXCEL",
                "PURCHASE_REGISTER_EXCEL",
                "OUTPUT_TAX_LIABILITY_CALC",
                "INPUT_TAX_CREDIT_ITC_SUMMARY",
                "BANK_STATEMENT_CURRENT_MONTH");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        logger.info("[GST Monthly] Validating for: " + app.getSubmissionId());

        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Tax Docs Uploaded");

        List<String> missing = new ArrayList<>();
        // Sales register is absolute minimum for GSTR-1
        if (!up.containsKey("SALES_REGISTER_EXCEL"))
            missing.add("SALES_REGISTER_EXCEL");

        if (!missing.isEmpty()) {
            throw new RuntimeException("Missing Critical GST Documents: " + String.join(", ", missing));
        }

        logger.info("[GST Monthly] Document Validation Passed.");
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. GSTR-1 Summary PDF (Outward Supplies)
        m.put("GSTR_1_SUMMARY_DRAFT", "/uploads/tax/" + sid + "/drafts/GSTR1_Summary.pdf");

        // 2. GSTR-1 JSON (Payload for GST Portal)
        m.put("GSTR_1_JSON_PAYLOAD", "/uploads/tax/" + sid + "/json/GSTR1_Payload.json");

        // 3. GSTR-3B Computation Sheet (Tax Liability - ITC = Net Payment)
        m.put("GSTR_3B_COMPUTATION_SHEET", "/uploads/tax/" + sid + "/drafts/GSTR3B_Calc.xlsx");

        // 4. Challan Draft (If tax payable)
        m.put("GST_PAYMENT_CHALLAN_DRAFT", "/uploads/tax/" + sid + "/drafts/GST_Challan.pdf");

        return m;
    }
}
