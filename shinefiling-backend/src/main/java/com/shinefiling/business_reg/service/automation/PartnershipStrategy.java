package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PartnershipStrategy implements IBusinessRegistrationStrategy {

    @Override
    public String getRegistrationType() {
        return "PARTNERSHIP_FIRM_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("PAN_PARTNER_1", "AADHAAR_PARTNER_1", "PAN_PARTNER_2", "AADHAAR_PARTNER_2",
                "OFFICE_RENT_AGREEMENT", "ELECTRICITY_BILL", "PARTNERSHIP_DEED_DATA_SHEET");
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        if (app.getUploadedDocuments() == null)
            throw new RuntimeException("No documents.");
        // Check keys
        for (String s : getRequiredDocuments()) {
            if (!app.getUploadedDocuments().containsKey(s))
                throw new RuntimeException("Missing: " + s);
        }
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Partnership Deed (Main Item)
        m.put("PARTNERSHIP_DEED_DRAFT", "/uploads/bus/" + sid + "/drafts/Deed_Draft.docx");

        // 2. Application Form 1 (for ROF)
        m.put("FORM_1_ROF_APPLICATION", "/uploads/bus/" + sid + "/drafts/Form1_ROF.pdf");

        // 3. Affidavit
        m.put("AFFIDAVIT_FOR_REGISTRATION", "/uploads/bus/" + sid + "/drafts/Affidavit.docx");

        return m;
    }
}
