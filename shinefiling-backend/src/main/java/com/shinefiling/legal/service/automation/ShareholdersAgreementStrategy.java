package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ShareholdersAgreementStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "SHAREHOLDERS_AGREEMENT";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("SHAREHOLDER_LIST", "RIGHTS_OBLIGATIONS", "EXIT_CLAUSE");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("SHA_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_SHA.docx");
        return m;
    }
}
