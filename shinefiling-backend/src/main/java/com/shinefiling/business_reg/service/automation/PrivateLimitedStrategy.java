package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PrivateLimitedStrategy implements IBusinessRegistrationStrategy {

    private static final Logger logger = LoggerFactory.getLogger(PrivateLimitedStrategy.class);

    @Override
    public String getRegistrationType() {
        return "PRIVATE_LIMITED_COMPANY_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        // Full list of documents required for Pvt Ltd
        return Arrays.asList(
                "PAN_CARD_DIRECTOR_1", "AADHAAR_CARD_DIRECTOR_1", "PHOTO_DIRECTOR_1", "BANK_STATEMENT_DIRECTOR_1",
                "PAN_CARD_DIRECTOR_2", "AADHAAR_CARD_DIRECTOR_2", "PHOTO_DIRECTOR_2", "BANK_STATEMENT_DIRECTOR_2",
                "ELECTRICITY_BILL_OFFICE", "RENT_AGREEMENT_OFFICE", "NOC_FROM_OWNER",
                "DIGITAL_SIGNATURE_CERTIFICATE_DSC");
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        logger.info("[PvtLtd] Starting Validation for SubID: " + app.getSubmissionId());

        Map<String, String> uploaded = app.getUploadedDocuments();
        if (uploaded == null || uploaded.isEmpty()) {
            throw new RuntimeException("Validation Failed: No documents uploaded.");
        }

        List<String> missing = new ArrayList<>();
        for (String doc : getRequiredDocuments()) {
            if (!uploaded.containsKey(doc)) {
                missing.add(doc);
            }
        }

        if (!missing.isEmpty()) {
            logger.error("[PvtLtd] Missing documents: " + missing);
            throw new RuntimeException("Missing Required Documents: " + String.join(", ", missing));
        }

        // Logical Validation
        if (uploaded.get("PAN_CARD_DIRECTOR_1").equals(uploaded.get("PAN_CARD_DIRECTOR_2"))) {
            throw new RuntimeException("Director 1 and Director 2 cannot use the same PAN card.");
        }

        logger.info("[PvtLtd] Validation Successful.");
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        logger.info("[PvtLtd] Generating Drafts...");
        Map<String, String> drafts = new HashMap<>();
        String sid = app.getSubmissionId();
        String time = String.valueOf(System.currentTimeMillis());

        // 1. SPICe+ Part A (Name Reservation) - Simulated
        drafts.put("SPICe_Part_A_Name_Approval", "/uploads/business/" + sid + "/drafts/SPICe_A_" + time + ".pdf");

        // 2. SPICe+ Part B (Incorporation)
        drafts.put("SPICe_Part_B_Form", "/uploads/business/" + sid + "/drafts/SPICe_B_" + time + ".pdf");

        // 3. eMOA (INC-33)
        drafts.put("eMOA_INC_33", "/uploads/business/" + sid + "/drafts/eMOA_" + time + ".pdf");

        // 4. eAOA (INC-34)
        drafts.put("eAOA_INC_34", "/uploads/business/" + sid + "/drafts/eAOA_" + time + ".pdf");

        // 5. AGILE PRO S (GST, EPFO, ESIC, Bank)
        drafts.put("AGILE_PRO_S_INC_35", "/uploads/business/" + sid + "/drafts/AGILE_" + time + ".pdf");

        // 6. INC-9 (Declaration)
        drafts.put("INC_9_Declaration", "/uploads/business/" + sid + "/drafts/INC9_" + time + ".pdf");

        // 7. DIR-2 (Director Consent)
        drafts.put("DIR_2_Consent_Dir1", "/uploads/business/" + sid + "/drafts/DIR2_D1.pdf");
        drafts.put("DIR_2_Consent_Dir2", "/uploads/business/" + sid + "/drafts/DIR2_D2.pdf");

        logger.info("[PvtLtd] Generated " + drafts.size() + " drafts.");
        return drafts;
    }
}
