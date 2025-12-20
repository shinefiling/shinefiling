package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TrademarkObjectionStrategy implements IIprStrategy {

    @Override
    public String getServiceType() {
        return "TRADEMARK_OBJECTION_REPLY";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("EXAMINATION_REPORT", "REPLY_DRAFT_WORD", "EVIDENCE_OF_USAGE", "USER_AFFIDAVIT");
    }

    @Override
    public void validate(IprApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        if (!up.containsKey("EXAMINATION_REPORT"))
            throw new RuntimeException("Examination Report is required to draft a reply.");
    }

    @Override
    public Map<String, String> generateDrafts(IprApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Reply to Examination Report (MIS-R)
        m.put("MIS_R_REPLY_DRAFT", "/uploads/ipr/" + sid + "/drafts/Reply_Objection.pdf");

        // 2. User Affidavit
        m.put("USER_AFFIDAVIT_DRAFT", "/uploads/ipr/" + sid + "/drafts/Affidavit.docx");

        return m;
    }
}
