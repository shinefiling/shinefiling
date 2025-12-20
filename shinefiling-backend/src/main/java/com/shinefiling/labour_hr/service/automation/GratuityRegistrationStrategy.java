package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class GratuityRegistrationStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "GRATUITY_ACT_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("FORM_A_NOTICE_OF_OPENING", "LIST_OF_EMPLOYEES_ELIGIBLE");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("FORM_I_GRATUITY_APP", "/uploads/labour/" + app.getSubmissionId() + "_FormI.pdf");
        return drafts;
    }
}
