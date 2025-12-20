package com.shinefiling.legal.service.automation;

import com.shinefiling.legal.model.LegalApplication;
import java.util.*;

public interface ILegalStrategy {
    String getServiceType();

    // Changed from just void getRequiredInputs() to standard validate
    List<String> getRequiredInputs(); // Return list of keys

    default void validate(LegalApplication app) {
        if (app.getUploadedDocuments() == null || app.getUploadedDocuments().isEmpty()) {
            throw new RuntimeException("No input documents/data provided.");
        }
        for (String key : getRequiredInputs()) {
            if (!app.getUploadedDocuments().containsKey(key)) {
                throw new RuntimeException("Missing required input: " + key);
            }
        }
    }

    Map<String, String> generateDrafts(LegalApplication app);
}
