package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class OpcStrategy implements IBusinessRegistrationStrategy {

    private static final Logger logger = LoggerFactory.getLogger(OpcStrategy.class);

    @Override
    public String getRegistrationType() {
        return "ONE_PERSON_COMPANY_OPC";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "PAN_CARD_MEMBER", "AADHAAR_CARD_MEMBER", "PHOTO_MEMBER", "BANK_STATEMENT_MEMBER",
                "PAN_CARD_NOMINEE", "AADHAAR_CARD_NOMINEE", "PHOTO_NOMINEE",
                "ELECTRICITY_BILL_OFFICE", "RENT_AGREEMENT_OFFICE", "NOC_FROM_OWNER");
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        logger.info("[OPC] Starting Validation for SubID: " + app.getSubmissionId());

        Map<String, String> uploaded = app.getUploadedDocuments();
        if (uploaded == null || uploaded.isEmpty()) {
            throw new RuntimeException("Validation Failed: No documents.");
        }

        List<String> missing = new ArrayList<>();
        for (String doc : getRequiredDocuments()) {
            if (!uploaded.containsKey(doc)) {
                missing.add(doc);
            }
        }
        if (!missing.isEmpty()) {
            throw new RuntimeException("Missing Docs for OPC: " + String.join(", ", missing));
        }

        // Single Member Check
        // In OPC, Member and Nominee cannot be same
        if (uploaded.get("PAN_CARD_MEMBER").equalsIgnoreCase(uploaded.get("PAN_CARD_NOMINEE"))) {
            throw new RuntimeException("Member and Nominee cannot be the same person.");
        }

        logger.info("[OPC] Validation Passed.");
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> drafts = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. INC-3 (Nominee Consent) - MANDATORY for OPC
        drafts.put("INC_3_NOMINEE_CONSENT", "/uploads/bus/" + sid + "/drafts/INC3_Nominee.pdf");

        // 2. MOA for OPC
        drafts.put("MOA_OPC_INC_33", "/uploads/bus/" + sid + "/drafts/MOA_OPC.pdf");

        // 3. AOA for OPC
        drafts.put("AOA_OPC_INC_34", "/uploads/bus/" + sid + "/drafts/AOA_OPC.pdf");

        // 4. SPICe+ B
        drafts.put("SPICe_Plus_Part_B", "/uploads/bus/" + sid + "/drafts/SPICe_B.pdf");

        // 5. DIR-2 Member
        drafts.put("DIR_2_CONSENT_MEMBER", "/uploads/bus/" + sid + "/drafts/DIR2_Member.pdf");

        return drafts;
    }
}
