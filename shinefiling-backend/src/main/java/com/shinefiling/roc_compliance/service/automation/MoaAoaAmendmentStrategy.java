package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class MoaAoaAmendmentStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "MOAAOA_AMENDMENT";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("Special_Resolution", "Explanatory_Statement", "Altered_MOA", "Altered_AOA");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("Special_Resolution"))
            throw new RuntimeException("Special Resolution is mandatory for Amendment.");
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. MGT-14 (Filing of Special Resolution)
        m.put("MGT_14_RESOLUTION_FILING", "/uploads/roc/" + sid + "/forms/MGT14_Amend.pdf");

        // 2. INC-24 (Only if Name Change involved, otherwise mostly MGT-14 covers
        // objects)
        // But for Object Change, MGT-14 is key.

        return m;
    }
}
