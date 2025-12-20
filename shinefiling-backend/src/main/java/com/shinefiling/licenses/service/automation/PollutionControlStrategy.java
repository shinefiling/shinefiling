package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PollutionControlStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "POLLUTION_CONTROL_CTE_CTO";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("PROJECT_REPORT", "SITE_PLAN", "WATER_BALANCE_CHART");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("CTE_APP", "/uploads/lic/" + app.getSubmissionId() + "_CTE.pdf");
        m.put("CTO_APP", "/uploads/lic/" + app.getSubmissionId() + "_CTO.pdf");
        return m;
    }
}
