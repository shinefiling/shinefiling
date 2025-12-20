package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class GstRegistrationStrategy implements ITaxComplianceStrategy {

    private static final Logger logger = LoggerFactory.getLogger(GstRegistrationStrategy.class);

    @Override
    public String getServiceType() {
        return "GST_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "PAN_CARD_BUSINESS", "PAN_CARD_PROPRIETOR", "AADHAAR_CARD_PROPRIETOR",
                "PASSPORT_PHOTO_PROPRIETOR", "RENT_AGREEMENT_OFFICE", "ELECTRICITY_BILL_OFFICE",
                "BANK_STATEMENT_CANCELLED_CHEQUE");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        logger.info("[GST] Validating SubID: " + app.getSubmissionId());

        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Docs Uploaded");

        List<String> missing = new ArrayList<>();
        for (String req : getRequiredDocuments()) {
            if (!up.containsKey(req))
                missing.add(req);
        }

        if (!missing.isEmpty()) {
            throw new RuntimeException("Missing GST Docs: " + String.join(", ", missing));
        }

        logger.info("[GST] Validation Passed.");
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. GST REG-01 (Part A & B)
        m.put("GST_REG_01_PART_A", "/uploads/tax/" + sid + "/drafts/REG01_A.pdf");
        m.put("GST_REG_01_PART_B", "/uploads/tax/" + sid + "/drafts/REG01_B.pdf");

        // 2. Authorization Letter
        m.put("AUTHORIZATION_LETTER", "/uploads/tax/" + sid + "/drafts/AuthLetter.pdf");

        return m;
    }
}
