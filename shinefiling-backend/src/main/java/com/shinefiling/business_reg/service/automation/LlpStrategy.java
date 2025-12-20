package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class LlpStrategy implements IBusinessRegistrationStrategy {

    private static final Logger logger = LoggerFactory.getLogger(LlpStrategy.class);

    @Override
    public String getRegistrationType() {
        return "LIMITED_LIABILITY_PARTNERSHIP_LLP";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "PAN_CARD_PARTNER_1", "AADHAAR_CARD_PARTNER_1", "PHOTO_PARTNER_1",
                "PAN_CARD_PARTNER_2", "AADHAAR_CARD_PARTNER_2", "PHOTO_PARTNER_2",
                "ELECTRICITY_BILL_OFFICE", "RENT_AGREEMENT_OFFICE", "NOC_FROM_OWNER",
                "SUBSCRIBER_SHEET_LLP");
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        logger.info("[LLP] Validation Start: " + app.getSubmissionId());
        Map<String, String> up = app.getUploadedDocuments();

        if (up == null || up.isEmpty())
            throw new RuntimeException("No docs.");

        List<String> missing = new ArrayList<>();
        for (String d : getRequiredDocuments()) {
            if (!up.containsKey(d))
                missing.add(d);
        }
        if (!missing.isEmpty())
            throw new RuntimeException("Missing LLP Docs: " + missing);

        logger.info("[LLP] Validation OK.");
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. FiLLiP (Form for Incorporation)
        m.put("FiLLiP_FORM_LLP", "/uploads/bus/" + sid + "/drafts/FiLLiP.pdf");

        // 2. Form 9 (Consent)
        m.put("FORM_9_CONSENT_PARTNERS", "/uploads/bus/" + sid + "/drafts/Form9_Consent.pdf");

        // 3. LLP Agreement (Crucial - to be filed in Form 3 within 30 days, but drafted
        // now)
        m.put("LLP_AGREEMENT_DRAFT", "/uploads/bus/" + sid + "/drafts/LLP_Agreement.docx");

        // 4. DSC Apps
        m.put("DSC_APPLICATION_P1", "/uploads/bus/" + sid + "/drafts/DSC_P1.pdf");
        m.put("DSC_APPLICATION_P2", "/uploads/bus/" + sid + "/drafts/DSC_P2.pdf");

        return m;
    }
}
