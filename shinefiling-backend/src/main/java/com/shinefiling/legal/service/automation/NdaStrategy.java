package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class NdaStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "NDA_NON_DISCLOSURE";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("PARTY_A_DETAILS", "PARTY_B_DETAILS", "CONFIDENTIALITY_SCOPE");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("NDA_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_NDA.docx");
        return m;
    }
}
