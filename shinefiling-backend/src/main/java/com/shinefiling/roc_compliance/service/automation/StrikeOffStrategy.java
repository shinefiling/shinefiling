package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class StrikeOffStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "STRIKE_OFF_COMPANY";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("STATEMENT_OF_ACCOUNTS_NIL", "INDEMNITY_BOND_STK_3", "AFFIDAVIT_STK_4",
                "BOARD_RESOLUTION");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        // Statement of Accounts showing NIL assets/liabilities is crucial
        if (!up.containsKey("STATEMENT_OF_ACCOUNTS_NIL"))
            throw new RuntimeException("Statement of Accounts showing NIL status is required.");
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. STK-2 (Application for removal of name)
        m.put("STK_2_FORM_DRAFT", "/uploads/roc/" + sid + "/forms/STK2.pdf");

        // 2. STK-3 (Indemnity Bond - every director)
        m.put("STK_3_INDEMNITY_BOND_DRAFT", "/uploads/roc/" + sid + "/drafts/STK3.docx");

        // 3. STK-4 (Affidavit - every director)
        m.put("STK_4_AFFIDAVIT_DRAFT", "/uploads/roc/" + sid + "/drafts/STK4.docx");

        return m;
    }
}
