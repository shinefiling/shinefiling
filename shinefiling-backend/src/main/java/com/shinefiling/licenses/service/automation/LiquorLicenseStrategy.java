package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class LiquorLicenseStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "BAR_LIQUOR_LICENSE"; // Matches "Bar / Liquor License"
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList(
                "RESTAURANT_REGISTRATION_CERTIFICATE",
                "FSSAI_FOOD_LICENSE",
                "FIRE_DEPARTMENT_NOC",
                "POLICE_NOC_CLEARANCE",
                "BUILDING_LAYOUT_PLAN_APPROVED",
                "AFFIDAVIT_NO_CRIMINAL_RECORD",
                "SOLVENCY_CERTIFICATE");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. CL-1 Application Form (Common format for Liquor)
        m.put("LIQUOR_LICENSE_APP_CL1", "/uploads/lic/" + sid + "/drafts/CL1_App.pdf");

        // 2. Affidavit Format for Excise
        m.put("EXCISE_AFFIDAVIT_DRAFT", "/uploads/lic/" + sid + "/drafts/Excise_Affidavit.docx");

        // 3. Request Letter for NOCs (if pending)
        m.put("NOC_REQUEST_TEMPLATE", "/uploads/lic/" + sid + "/internal/NOC_Req.docx");

        return m;
    }
}
