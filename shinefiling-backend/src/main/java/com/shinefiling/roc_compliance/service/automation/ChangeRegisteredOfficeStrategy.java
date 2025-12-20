package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ChangeRegisteredOfficeStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "CHANGE_OF_REGISTERED_OFFICE";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("NEW_ADDRESS_PROOF", "RENT_AGREEMENT_NEW", "NOC_FROM_OWNER", "BOARD_RESOLUTION");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("NEW_ADDRESS_PROOF"))
            throw new RuntimeException("Proof of New Address is missing.");
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. INC-22 (Notice of situation of office)
        m.put("INC_22_FORM_DRAFT", "/uploads/roc/" + sid + "/forms/INC22.pdf");

        // 2. MGT-14 (If applicable for shifting outside local limits)
        m.put("MGT_14_FORM_DRAFT", "/uploads/roc/" + sid + "/forms/MGT14.pdf");

        return m;
    }
}
