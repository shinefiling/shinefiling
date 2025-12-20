package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class FireNocStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "FIRE_SAFETY_NOC";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("BUILDING_PLAN_APPROVAL", "FIRE_EXTINGUISHER_INVOICE", "OWNERSHIP_PROOF");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FIRE_NOC_APP", "/uploads/lic/" + app.getSubmissionId() + "_FireNoc.pdf");
        return m;
    }
}
