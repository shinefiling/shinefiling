package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class AddRemoveDirectorStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "ADDREMOVE_DIRECTOR";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("DIR_12_DETAILS", "DIR_2_CONSENT_NEW_DIRECTOR", "RESIGNATION_LETTER",
                "BOARD_RESOLUTION_COPY");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No documents.");

        if (!up.containsKey("BOARD_RESOLUTION_COPY")) {
            throw new RuntimeException("Board Resolution is mandatory for adding/removing director.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. DIR-12 (Appointment/Resignation Form)
        m.put("DIR_12_FORM_DRAFT", "/uploads/roc/" + sid + "/forms/DIR12.pdf");

        // 2. Board Resolution Draft
        m.put("BOARD_RESOLUTION_DRAFT", "/uploads/roc/" + sid + "/internal/Resolution_Draft.docx");

        // 3. DIR-2 (Consent - if adding logic detected)
        m.put("DIR_2_CONSENT_DRAFT", "/uploads/roc/" + sid + "/forms/DIR2_Consent.pdf");

        return m;
    }
}
