package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class MinimumWagesStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "MINIMUM_WAGES_COMPLIANCE";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("ATTENDANCE_REGISTER", "WAGE_SLIPS", "OVERTIME_REGISTER_FORM_IV");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("ANNUAL_RETURN_FORM_III", "/uploads/labour/" + app.getSubmissionId() + "_FormIII.pdf");
        return drafts;
    }
}
