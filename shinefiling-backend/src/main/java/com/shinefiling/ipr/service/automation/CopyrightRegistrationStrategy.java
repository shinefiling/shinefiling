package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class CopyrightRegistrationStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "COPYRIGHT_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("WORK_COPY_SOFTWARE_CODE_ART", "NOC_FROM_AUTHOR", "ID_PROOF_APPLICANT");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("WORK_COPY_SOFTWARE_CODE_ART"))
            throw new RuntimeException("Copy of Work (Source Code/Art) is required.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Form XIV (Application for Registration of Copyright)
        m.put("FORM_XIV_COPYRIGHT_APP", "/uploads/ipr/" + sid + "/forms/FormXIV.pdf");

        // 2. Statement of Particulars
        m.put("STATEMENT_OF_PARTICULARS", "/uploads/ipr/" + sid + "/forms/SOP.pdf");

        return m;
    }
}
