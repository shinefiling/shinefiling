package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PfRegistrationStrategy implements ILabourStrategy {
    @Override
    public String getServiceType() {
        return "PF_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("PAN_CARD", "GST_CERTIFICATE", "CANCELLED_CHEQUE", "EMPLOYEE_LIST", "DSC_OF_DIRECTOR");
    }

    @Override
    public void validate(LabourApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(LabourApplication app) {
        Map<String, String> drafts = new HashMap<>();
        drafts.put("PF_REGISTRATION_FORM", "/uploads/labour/" + app.getSubmissionId() + "_PF_Reg.pdf");
        drafts.put("SPECIMEN_SIGNATURE_CARD", "/uploads/labour/" + app.getSubmissionId() + "_Specimen.pdf");
        return drafts;
    }
}
