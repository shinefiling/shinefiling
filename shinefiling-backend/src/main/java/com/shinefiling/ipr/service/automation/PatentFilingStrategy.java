package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PatentFilingStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "PATENT_FILING_PROVISIONAL_COMPLETE";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("PATENT_SPECIFICATION_DRAFT", "DRAWINGS_DIAGRAMS", "FORM_1_APPLICATION",
                "FORM_2_SPECIFICATION");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("PATENT_SPECIFICATION_DRAFT"))
            throw new RuntimeException("Patent Specification Draft is mandatory.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Form 1 (Application for Grant)
        m.put("FORM_1_PATENT_APP", "/uploads/ipr/" + sid + "/forms/Form1.pdf");

        // 2. Form 2 (Provisional/Complete Specification)
        m.put("FORM_2_SPECIFICATION", "/uploads/ipr/" + sid + "/forms/Form2.pdf");

        // 3. Form 3 (Foreign Filing)
        m.put("FORM_3_FOREIGN_FILING", "/uploads/ipr/" + sid + "/forms/Form3.pdf");

        // 4. Form 5 (Declaration of Inventorship)
        m.put("FORM_5_INVENTORSHIP", "/uploads/ipr/" + sid + "/forms/Form5.pdf");

        return m;
    }
}
