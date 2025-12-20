package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class EmploymentAgreementStrategy implements ILegalStrategy {
    @Override
    public String getServiceType() {
        return "EMPLOYMENT_AGREEMENT";
    }

    @Override
    public List<String> getRequiredInputs() {
        return Arrays.asList("EMPLOYEE_ROLE", "CTC_BREAKUP", "NOTICE_PERIOD");
    }

    @Override
    public Map<String, String> generateDrafts(LegalApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("EMPLOYMENT_AGREEMENT_DRAFT", "/uploads/legal/" + app.getSubmissionId() + "_Employment.docx");
        return m;
    }
}
