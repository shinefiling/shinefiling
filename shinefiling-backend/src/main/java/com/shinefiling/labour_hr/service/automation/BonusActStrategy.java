package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class BonusActStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "BONUS_ACT_COMPLIANCE";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("ALLOCABLE_SURPLUS_COMPUTATION", "REGISTER_OF_BONUS_FORM_C");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("FORM_D_ANNUAL_RETURN", "/uploads/labour/" + app.getSubmissionId() + "_FormD.pdf");
        return drafts;
    }
}
