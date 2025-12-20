package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TrademarkRenewalStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "TRADEMARK_RENEWAL";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("TM_CERTIFICATE", "CURRENT_USAGE_PROOF");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("TM_CERTIFICATE"))
            throw new RuntimeException("Original TM Certificate required.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. TM-R (Renewal Application)
        m.put("TM_R_RENEWAL_FORM", "/uploads/ipr/" + sid + "/forms/TM_R.pdf");

        return m;
    }
}
