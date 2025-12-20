package com.shinefiling.certifications.service.automation;

import com.shinefiling.certifications.model.CertificationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TanPanStrategy implements ICertificationStrategy {
    @Override
    public String getServiceType() {
        return "TAN_PAN_APPLICATION";
    }

    @Override
    public void validate(CertificationApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(CertificationApplication app) {
        return new HashMap<>();
    }
}
