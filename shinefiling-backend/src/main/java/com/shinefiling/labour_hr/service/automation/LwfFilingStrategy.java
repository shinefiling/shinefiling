package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class LwfFilingStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "LABOUR_WELFARE_FUND";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("WAGE_REGISTER", "EMPLOYEE_CONTRIBUTION_LIST");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("LWF_FORM_A", "/uploads/labour/" + app.getSubmissionId() + "_FormA_LWF.pdf");
        return drafts;
    }
}
