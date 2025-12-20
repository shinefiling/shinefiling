package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PartnershipDeedStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "PARTNERSHIP_DEED";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("PARTNER_DETAILS", "CAPITAL_CONTRIBUTION", "PROFIT_SHARING_RATIO");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("PARTNERSHIP_DEED_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_Deed.docx");
        return m;
    }
}
