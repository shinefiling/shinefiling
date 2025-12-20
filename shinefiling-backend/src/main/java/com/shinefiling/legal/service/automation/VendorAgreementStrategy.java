package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class VendorAgreementStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "VENDOR_AGREEMENT";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("VENDOR_DETAILS", "SERVICE_SCOPE", "PAYMENT_TERMS");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("VENDOR_AGREEMENT_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_Vendor.docx");
        return m;
    }
}
