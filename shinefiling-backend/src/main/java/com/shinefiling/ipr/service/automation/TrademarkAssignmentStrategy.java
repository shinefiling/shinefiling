package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TrademarkAssignmentStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "TRADEMARK_ASSIGNMENT";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("ASSIGNMENT_DEED", "NOC_FROM_ASSIGNOR", "TM_CERTIFICATE_ORIGINAL");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No docs");
        if (!up.containsKey("ASSIGNMENT_DEED"))
            throw new RuntimeException("Assignment Deed is mandatory.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. TM-P (Application for Assignment)
        m.put("TM_P_ASSIGNMENT_FORM", "/uploads/ipr/" + sid + "/forms/TM_P.pdf");

        return m;
    }
}
