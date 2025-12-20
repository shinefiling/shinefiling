package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TradeLicenseStrategy implements ILicenseStrategy {
    @Override
    public String getType() {
        return "TRADE_LICENSE";
    }

    @Override
    public List<String> getDocs() {
        return Arrays.asList("ID_PROOF", "ADDRESS_PROOF", "PROPERTY_TAX_RECEIPT", "NOC_NEIGHBORS");
    }

    @Override
    public Map<String, String> generate(LicenseApplication app) {
        Map<String, String> m = new HashMap<>();
        m.put("TRADE_LICENSE_APP", "/uploads/lic/" + app.getSubmissionId() + "_TradeApp.pdf");
        return m;
    }
}
