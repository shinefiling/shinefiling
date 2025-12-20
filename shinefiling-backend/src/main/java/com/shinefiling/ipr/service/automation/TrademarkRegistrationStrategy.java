package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TrademarkRegistrationStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "TRADEMARK_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("LOGO_IMAGE", "PAN_CARD", "AADHAAR_CARD", "MSME_CERTIFICATE", "POWER_OF_ATTORNEY_TM48");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No docs");

        if (!up.containsKey("LOGO_IMAGE"))
            throw new RuntimeException("Logo Image is mandatory for Trademark.");
        if (!up.containsKey("POWER_OF_ATTORNEY_TM48"))
            throw new RuntimeException("Signed TM-48 (Power of Attorney) is mandatory.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. TM-A (Application for Registration)
        m.put("TM_A_FORM_DRAFT", "/uploads/ipr/" + sid + "/forms/TM_A.pdf");

        // 2. Additional Representation Sheet
        m.put("ADDITIONAL_REPRESENTATION_SHEET", "/uploads/ipr/" + sid + "/forms/Add_Rep.pdf");

        return m;
    }
}
