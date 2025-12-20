package com.shinefiling.certifications.service.automation;

import com.shinefiling.certifications.model.CertificationApplication;
import java.util.*;

public interface ICertificationStrategy {
    String getServiceType();

    void validate(CertificationApplication app);

    Map<String, String> generateDrafts(CertificationApplication app);
}
