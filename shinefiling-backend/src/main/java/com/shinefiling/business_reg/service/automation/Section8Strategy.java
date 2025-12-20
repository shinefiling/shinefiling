package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class Section8Strategy implements IBusinessRegistrationStrategy {

    @Override
    public String getRegistrationType() {
        return "SECTION_8_NGO_COMPANY";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("PAN_DIR_1", "AADHAAR_DIR_1", "PAN_DIR_2", "AADHAAR_DIR_2",
                "OFFICE_PROOF", "PROJECTED_INCOME_EXPENDITURE_3_YEARS");
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

        // 1. INC-12 (Application for License)
        m.put("INC_12_LICENSE_APP", "/uploads/bus/" + sid + "/drafts/INC12.pdf");

        // 2. INC-13 (MOA for Section 8)
        m.put("INC_13_MOA_SECTION8", "/uploads/bus/" + sid + "/drafts/INC13_MOA.pdf");

        // 3. INC-14 (Declaration by Professional)
        m.put("INC_14_DECLARATION", "/uploads/bus/" + sid + "/drafts/INC14.pdf");

        // 4. INC-15 (Declaration by Subscribers)
        m.put("INC_15_DECLARATION", "/uploads/bus/" + sid + "/drafts/INC15.pdf");

        return m;
    }
}
