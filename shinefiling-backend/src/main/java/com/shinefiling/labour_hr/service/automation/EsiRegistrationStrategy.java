package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class EsiRegistrationStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "ESI_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("PAN_OF_ENTITY", "ADDRESS_PROOF", "EMPLOYEE_DETAILS_WITH_SALARY");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("ESI_FORM_01", "/uploads/labour/" + app.getSubmissionId() + "_Form01.pdf");
        return drafts;
    }
}
