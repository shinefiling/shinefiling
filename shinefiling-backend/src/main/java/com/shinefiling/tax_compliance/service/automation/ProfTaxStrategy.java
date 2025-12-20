package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ProfTaxStrategy implements ITaxComplianceStrategy {

    @Override
    public String getServiceType() {
        return "PROFESSIONAL_TAX_REG_FILING";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "SHOP_ACT_LICENSE",
                "PAN_CARD_BUSINESS",
                "EMPLOYEE_SALARY_DATA_EXCEL",
                "PT_ENROLLMENT_CERTIFICATE_PTEC",
                "PT_REGISTRATION_CERTIFICATE_PTRC");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Docs");

        if (!up.containsKey("EMPLOYEE_SALARY_DATA_EXCEL")) {
            throw new RuntimeException("Employee Salary Data is required to calculate PT liability.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. PT Return Form (e.g., Form 5 in many states)
        m.put("PT_RETURN_FORM_DRAFT", "/uploads/tax/" + sid + "/drafts/PT_Return.pdf");

        // 2. PT Payment Challan
        m.put("PT_PAYMENT_CHALLAN", "/uploads/tax/" + sid + "/drafts/PT_Challan.pdf");

        // 3. Employee Wise Deduction Report
        m.put("PT_DEDUCTION_REPORT", "/uploads/tax/" + sid + "/drafts/PT_Report.xlsx");

        return m;
    }
}
