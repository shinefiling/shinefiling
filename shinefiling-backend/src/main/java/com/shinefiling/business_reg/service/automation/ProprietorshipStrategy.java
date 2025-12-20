package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ProprietorshipStrategy implements IBusinessRegistrationStrategy {

    @Override
    public String getRegistrationType() {
        return "SOLE_PROPRIETORSHIP_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("PAN_CARD_PROPRIETOR", "AADHAAR_CARD_PROPRIETOR", "PHOTO_PROPRIETOR",
                "BANK_STATEMENT_CANCELLED_CHEQUE", "OFFICE_PROOF");
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        if (app.getUploadedDocuments() == null)
            throw new RuntimeException("No docs.");
        for (String s : getRequiredDocuments()) {
            if (!app.getUploadedDocuments().containsKey(s))
                throw new RuntimeException("Missing: " + s);
        }
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Udyam Registration (Output is Udyam Number usually, but here draft app)
        m.put("UDYAM_APPLICATION_DRAFT", "/uploads/bus/" + sid + "/drafts/Udyam_App.pdf");

        // 2. GST Registration (optional but common for Prop)
        m.put("GST_APPLICATION_PROPRIETOR", "/uploads/bus/" + sid + "/drafts/GST_Reg_01.pdf");

        // 3. Shop Act (Intimation)
        m.put("SHOP_ACT_INTIMATION", "/uploads/bus/" + sid + "/drafts/ShopAct.pdf");

        return m;
    }
}
