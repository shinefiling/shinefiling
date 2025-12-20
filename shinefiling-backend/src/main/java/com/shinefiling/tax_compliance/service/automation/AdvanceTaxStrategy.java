package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class AdvanceTaxStrategy implements ITaxComplianceStrategy {

    @Override
    public String getServiceType() {
        return "ADVANCE_TAX_FILING";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "ESTIMATED_PROFIT_LOSS_CURRENT_YEAR",
                "TDS_CREDIT_ESTIMATES",
                "PREVIOUS_YEAR_ITR",
                "BANK_STATEMENTS_TILL_DATE");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Docs");

        if (!up.containsKey("ESTIMATED_PROFIT_LOSS_CURRENT_YEAR")) {
            throw new RuntimeException("Estimated P&L is required to calculate Advance Tax.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Advance Tax Calculation Sheet (showing 15%, 45%, 75%, 100% installments)
        m.put("ADVANCE_TAX_CALCULATION_SHEET", "/uploads/tax/" + sid + "/drafts/AdvTax_Calc.xlsx");

        // 2. ITNS 280 Challan (for payment)
        m.put("ITNS_280_CHALLAN_DRAFT", "/uploads/tax/" + sid + "/drafts/Challan_280.pdf");

        return m;
    }
}
