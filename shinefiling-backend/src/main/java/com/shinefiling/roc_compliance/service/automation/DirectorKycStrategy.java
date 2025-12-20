package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DirectorKycStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "DIRECTOR_KYC_DIR3_KYC";
    }

    @Override
    public List<String> getRequiredDocuments() {
        // For DIR-3 KYC, we need personal proofs and unique mobile/email for OTP
        return Arrays.asList("PAN_CARD", "AADHAAR_CARD", "PASSPORT_IF_DATA_CHANGE", "MOBILE_EMAIL_DECLARATION");
    }

    @Override
    public void validate(RocApplication app) {
        if (app.getUploadedDocuments() == null || app.getUploadedDocuments().isEmpty()) {
            throw new RuntimeException("No documents uploaded for KYC.");
        }
        if (!app.getUploadedDocuments().containsKey("PAN_CARD")) {
            throw new RuntimeException("PAN Card is mandatory for Director KYC.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. DIR-3 KYC Web Form (system generated data)
        m.put("DIR_3_KYC_WEB_DATA", "/uploads/roc/" + sid + "/forms/DIR3_KYC_Web.pdf");

        // 2. DIR-3 KYC E-Form (if data changed)
        m.put("DIR_3_KYC_EFORM", "/uploads/roc/" + sid + "/forms/DIR3_KYC_Form.pdf");

        return m;
    }
}
