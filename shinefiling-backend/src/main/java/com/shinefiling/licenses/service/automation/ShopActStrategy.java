package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ShopActStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "SHOP_ESTABLISHMENT_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("PAN_CARD", "AADHAAR_CARD", "SHOP_PHOTO_WITH_BOARD", "RENT_AGREEMENT");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FORM_A_APPLICATION", "/uploads/lic/" + app.getSubmissionId() + "_FormA.pdf");
        return m;
    }
}
