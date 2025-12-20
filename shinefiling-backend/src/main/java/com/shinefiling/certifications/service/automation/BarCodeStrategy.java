package com.shinefiling.certifications.service.automation;

import com.shinefiling.certifications.model.CertificationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class BarCodeStrategy implements ICertificationStrategy {
    @Override
    public String getServiceType() {
        return "BAR_CODE_REGISTRATION";
    }

    @Override
    public void validate(CertificationApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(CertificationApplication app) {
        return new HashMap<>();
    }
}
