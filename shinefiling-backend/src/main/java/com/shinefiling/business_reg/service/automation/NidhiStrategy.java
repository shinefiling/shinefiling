package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class NidhiStrategy implements IBusinessRegistrationStrategy {

    @Override
    public String getRegistrationType() {
        return "NIDHI_COMPANY_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        // Nidhi requires 7 members, 3 directors minimum
        List<String> docs = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            docs.add("PAN_DIRECTOR_" + i);
            docs.add("AADHAAR_DIRECTOR_" + i);
        }
        for (int i = 1; i <= 7; i++) {
            docs.add("PAN_MEMBER_" + i);
        }
        docs.add("OFFICE_PROOF");
        return docs;
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        if (app.getUploadedDocuments() == null)
            throw new RuntimeException("No docs.");
        // We can check for a subset for now
        if (!app.getUploadedDocuments().containsKey("PAN_DIRECTOR_1") ||
                !app.getUploadedDocuments().containsKey("PAN_MEMBER_7")) {
            throw new RuntimeException("Nidhi requires minimum 3 Directors and 7 Members documents.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. NDH-4 (Declaration of Nidhi Status - technically post-incorp, but drafted
        // now)
        m.put("NDH_4_DRAFT", "/uploads/bus/" + sid + "/drafts/NDH4_Draft.pdf");

        // 2. MOA (Specific Nidhi Objects)
        m.put("MOA_NIDHI", "/uploads/bus/" + sid + "/drafts/MOA_Nidhi.pdf");

        // 3. INC-9 for 7 subscribers
        m.put("INC_9_SUBSCRIBERS", "/uploads/bus/" + sid + "/drafts/INC9_7_Members.pdf");

        return m;
    }
}
