package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PublicLimitedStrategy implements IBusinessRegistrationStrategy {

    @Override
    public String getRegistrationType() {
        return "PUBLIC_LIMITED_COMPANY";
    }

    @Override
    public List<String> getRequiredDocuments() {
        List<String> d = new ArrayList<>();
        // 3 Directors
        for (int i = 1; i <= 3; i++)
            d.add("PAN_DIR_" + i);
        // 7 Shareholders
        for (int i = 1; i <= 7; i++)
            d.add("PAN_SHAREHOLDER_" + i);
        d.add("OFFICE_PROOF");
        return d;
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        if (app.getUploadedDocuments() == null)
            throw new RuntimeException("No docs");
        if (!app.getUploadedDocuments().containsKey("PAN_DIR_3"))
            throw new RuntimeException("Public Ltd requires minimum 3 Directors.");
        if (!app.getUploadedDocuments().containsKey("PAN_SHAREHOLDER_7"))
            throw new RuntimeException("Public Ltd requires minimum 7 Shareholders.");
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. DIR-12 (For Directors)
        m.put("DIR_12_APPOINTMENT", "/uploads/bus/" + sid + "/drafts/DIR12.pdf");

        // 2. Statement in Lieu of Prospectus (distinctive for Public)
        m.put("STATEMENT_LIEU_PROSPECTUS", "/uploads/bus/" + sid + "/drafts/Prospectus_Statement.pdf");

        // 3. MOA Public
        m.put("MOA_PUBLIC_LTD", "/uploads/bus/" + sid + "/drafts/MOA_Public.pdf");

        return m;
    }
}
