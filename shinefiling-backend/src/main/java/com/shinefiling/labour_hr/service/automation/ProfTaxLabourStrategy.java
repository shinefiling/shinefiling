package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ProfTaxLabourStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "PROFESSIONAL_TAX";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("INCORPORATION_CERTIFICATE", "DIRECTOR_ADDRESS_PROOF", "EMPLOYEE_DATA");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("PT_ENROLLMENT_FORM", "/uploads/labour/" + app.getSubmissionId() + "_PT_Enrollment.pdf");
        drafts.put("PT_REGISTRATION_FORM", "/uploads/labour/" + app.getSubmissionId() + "_PT_Registration.pdf");
        return drafts;
    }
}
