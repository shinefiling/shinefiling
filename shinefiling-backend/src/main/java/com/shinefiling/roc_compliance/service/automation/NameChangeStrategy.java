package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class NameChangeStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "COMPANY_NAME_CHANGE";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("RUN_NAME_APPROVAL_LETTER", "SPECIAL_RESOLUTION", "ALTERED_MOA_AOA", "BOARD_RESOLUTION");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        // Need Central Govt Approval (RUN Service) before filing INC-24
        if (!up.containsKey("RUN_NAME_APPROVAL_LETTER"))
            throw new RuntimeException("Name Approval Letter (RUN) is required.");
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. INC-24 (Application for Change of Name)
        m.put("INC_24_FORM_DRAFT", "/uploads/roc/" + sid + "/forms/INC24.pdf");

        // 2. MGT-14 (Special Resolution)
        m.put("MGT_14_RESOLUTION", "/uploads/roc/" + sid + "/forms/MGT14_Name.pdf");

        return m;
    }
}
