package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class FoundersAgreementStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "FOUNDERS_AGREEMENT";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("FOUNDER_ROLES", "EQUITY_SPLIT", "VESTING_SCHEDULE");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FOUNDERS_AGREEMENT_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_Founders.docx");
        return m;
    }
}
