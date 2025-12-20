package com.shinefiling.certifications.service.automation;

import com.shinefiling.certifications.model.CertificationApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class IsoStrategy implements ICertificationStrategy {
    @Override
    public String getServiceType() {
        return "ISO_CERTIFICATION_9001_14001";
    }

    @Override
    public void validate(CertificationApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(CertificationApplication app) {
        return new HashMap<>();
    }
}
