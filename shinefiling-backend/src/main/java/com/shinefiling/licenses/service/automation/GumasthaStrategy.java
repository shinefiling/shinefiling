package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class GumasthaStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "GUMASTHA_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("SHOP_ESTABLISHMENT_PROOF", "PAN_CARD", "PHOTO", "RENT_AGREEMENT");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("GUMASTHA_APPLICATION_FORM", "/uploads/lic/" + app.getSubmissionId() + "_Gumastha.pdf");
        return m;
    }
}
