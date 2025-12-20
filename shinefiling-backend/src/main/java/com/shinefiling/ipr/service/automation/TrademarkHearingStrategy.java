package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TrademarkHearingStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "TRADEMARK_HEARING_SUPPORT";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("HEARING_NOTICE", "ATTENDANCE_AUTHORIZATION", "WRITTEN_SUBMISSIONS");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("HEARING_NOTICE"))
            throw new RuntimeException("Hearing Notice is required.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Written Submissions
        m.put("WRITTEN_SUBMISSIONS_DRAFT", "/uploads/ipr/" + sid + "/drafts/Submissions.pdf");

        return m;
    }
}
