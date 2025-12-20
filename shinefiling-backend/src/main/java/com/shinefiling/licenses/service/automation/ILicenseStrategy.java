package com.shinefiling.licenses.service.automation;

import com.shinefiling.licenses.model.LicenseApplication;
import java.util.List;
import java.util.Map;

public interface ILicenseStrategy {
    String getType();

    List<String> getDocs();

    // robust default validation
    default void validate(LicenseApplication app) {
        if (app.getUploadedDocuments() == null || app.getUploadedDocuments().isEmpty()) {
            throw new RuntimeException("No supporting documents uploaded for this license.");
        }
        for (String doc : getDocs()) {
            if (!app.getUploadedDocuments().containsKey(doc)) {
                throw new RuntimeException("Missing Mandatory Document: " + doc);
            }
        }
    }

    Map<String, String> generate(LicenseApplication app);
}
