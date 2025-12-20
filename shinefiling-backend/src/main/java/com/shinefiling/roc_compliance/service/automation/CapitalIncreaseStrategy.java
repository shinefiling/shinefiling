package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class CapitalIncreaseStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "INCREASE_AUTHORIZED_CAPITAL";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("Notice_of_EGM", "Ordinary_Resolution", "Amended_MOA_Draft", "Amended_AOA_Draft");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("Amended_MOA_Draft"))
            throw new RuntimeException("Draft of Amended MOA is required.");
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. SH-7 (Notice to Registrar for alteration)
        m.put("SH_7_FORM_DRAFT", "/uploads/roc/" + sid + "/forms/SH7.pdf");

        // 2. MGT-14 (Filing of Resolution - sometimes required if articles altered)
        m.put("MGT_14_FORM", "/uploads/roc/" + sid + "/forms/MGT14_Cap.pdf");

        return m;
    }
}
