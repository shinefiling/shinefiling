package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DrugLicenseStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "DRUG_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("PHARMACIST_REGISTRATION", "BLUEPRINT_OF_PREMISES", "REFRIGERATOR_INVOICE");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FORM_19_20_21", "/uploads/lic/" + app.getSubmissionId() + "_DrugForms.pdf");
        return m;
    }
}
