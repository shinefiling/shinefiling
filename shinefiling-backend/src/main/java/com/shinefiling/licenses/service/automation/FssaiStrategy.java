package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class FssaiStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "FSSAI_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("PHOTO", "ID_PROOF", "PREMISES_PROOF", "WATER_TEST_REPORT", "FOOD_CATEGORY_LIST");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FORM_B_APPLICATION", "/uploads/lic/" + app.getSubmissionId() + "_FormB.pdf");
        m.put("DECLARATION_FORM", "/uploads/lic/" + app.getSubmissionId() + "_Declaration.pdf");
        return m;
    }
}
