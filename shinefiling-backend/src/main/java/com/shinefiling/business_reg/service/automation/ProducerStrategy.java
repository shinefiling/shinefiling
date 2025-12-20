package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ProducerStrategy implements IBusinessRegistrationStrategy {

    @Override
    public String getRegistrationType() {
        return "PRODUCER_COMPANY_REGISTRATION";
    }

    @Override
    public List<String> getRequiredDocuments() {
        // 5 Directors minimum, Promoters must be farmers
        return Arrays.asList("PAN_PROMOTER_1", "AADHAAR_PROMOTER_1", "FARMER_CERTIFICATE_1",
                "PAN_PROMOTER_2", "AADHAAR_PROMOTER_2", "FARMER_CERTIFICATE_2",
                "PAN_PROMOTER_3", "AADHAAR_PROMOTER_3", "FARMER_CERTIFICATE_3",
                "PAN_PROMOTER_4", "AADHAAR_PROMOTER_4", "FARMER_CERTIFICATE_4",
                "PAN_PROMOTER_5", "AADHAAR_PROMOTER_5", "FARMER_CERTIFICATE_5",
                "OFFICE_PROOF");
    }

    @Override
    public void validate(BusinessRegistrationApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No docs");

        if (!up.containsKey("FARMER_CERTIFICATE_1"))
            throw new RuntimeException("Farmer Certificate is MANDATORY for Producer Company.");
    }

    @Override
    public Map<String, String> generateDrafts(BusinessRegistrationApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. MOA with Producer Objects
        m.put("MOA_PRODUCER", "/uploads/bus/" + sid + "/drafts/MOA_Producer.pdf");

        // 2. DIR-2 for 5 Directors
        m.put("DIR_2_CONSENT_5_DIRS", "/uploads/bus/" + sid + "/drafts/DIR2_5_Dirs.pdf");

        // 3. INC-14 (Professional Declaration)
        m.put("INC_14_DECLARATION", "/uploads/bus/" + sid + "/drafts/INC14.pdf");

        return m;
    }
}
