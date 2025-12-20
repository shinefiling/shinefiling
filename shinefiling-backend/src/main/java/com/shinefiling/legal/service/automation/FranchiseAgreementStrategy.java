package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class FranchiseAgreementStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "FRANCHISE_AGREEMENT";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("FRANCHISOR_DETAILS", "FRANCHISEE_DETAILS", "ROYALTY_TERMS");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FRANCHISE_AGREEMENT_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_Franchise.docx");
        return m;
    }
}
