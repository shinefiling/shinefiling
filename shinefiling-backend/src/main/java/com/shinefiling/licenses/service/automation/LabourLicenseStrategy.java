package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class LabourLicenseStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "LABOUR_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("CONTRACTOR_DETAILS", "WORK_ORDER_COPY", "CHALLAN_COPY", "FORM_V");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("FORM_IV_APPLICATION", "/uploads/lic/" + app.getSubmissionId() + "_FormIV.pdf");
        return m;
    }
}
