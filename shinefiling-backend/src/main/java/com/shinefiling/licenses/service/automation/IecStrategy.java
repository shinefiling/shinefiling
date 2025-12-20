package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class IecStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "IMPORT_EXPORT_CODE_IEC";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("PAN_CARD", "AADHAAR_CARD", "CANCELLED_CHEQUE");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("IEC_APP_DGFT", "/uploads/lic/" + app.getSubmissionId() + "_DGFT.pdf");
        return m;
    }
}
