package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class FactoryLicenseStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "FACTORY_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("FACTORY_BLUEPRINT", "MACHINERY_LIST", "POWER_SANCTION", "NOC_FIRE");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FORM_1_APPLICATION", "/uploads/lic/" + app.getSubmissionId() + "_Form1.pdf");
        return m;
    }
}
