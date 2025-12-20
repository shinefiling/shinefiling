package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DesignRegistrationStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "DESIGN_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("DESIGN_REPRESENTATION_IMAGES_ANGLES", "NOVELTY_STATEMENT", "POA_FORM_21");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("DESIGN_REPRESENTATION_IMAGES_ANGLES"))
            throw new RuntimeException("Images of Design (Top, Side, Front) are mandatory.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Form 1 (Application for Registration of Design)
        m.put("FORM_1_DESIGN_APP", "/uploads/ipr/" + sid + "/forms/Form1.pdf");

        // 2. Representation Sheet
        m.put("REPRESENTATION_SHEET", "/uploads/ipr/" + sid + "/forms/RepSheet.pdf");

        return m;
    }
}
