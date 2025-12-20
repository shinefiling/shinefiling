package com.shinefiling.certifications.service.automation;

import com.shinefiling.certifications.model.CertificationApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class MsmeStrategy implements ICertificationStrategy {

    private static final Logger logger = LoggerFactory.getLogger(MsmeStrategy.class);

    @Override
    public String getServiceType() {
        return "MSME_UDYAM_REGISTRATION";
    }

    @Override
    public void validate(CertificationApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No docs for MSME.");

        if (!up.containsKey("AADHAAR_CARD") || !up.containsKey("PAN_CARD")) {
            throw new RuntimeException("Aadhaar and PAN are mandatory for Udyam.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(CertificationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Udyam Registration Draft
        m.put("UDYAM_REGISTRATION_DRAFT", "/uploads/cert/" + sid + "/drafts/Udyam_Draft.pdf");

        return m;
    }
}
