package com.shinefiling.business_reg.util;

import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PrivateLimitedDocGenerator {

    public Map<String, String> generateDocuments(PrivateLimitedApplication app) {
        Map<String, String> generatedDocs = new HashMap<>();

        // Mock Document Generation Logic
        // In a real scenario, this would generate PDFs using IText/Apache PDFBox

        generatedDocs.put("MOA", "http://localhost:8080/api/files/download/MOA_" + app.getSubmissionId() + ".pdf");
        generatedDocs.put("AOA", "http://localhost:8080/api/files/download/AOA_" + app.getSubmissionId() + ".pdf");
        generatedDocs.put("INC-9", "http://localhost:8080/api/files/download/INC9_" + app.getSubmissionId() + ".pdf");
        generatedDocs.put("DIR-2", "http://localhost:8080/api/files/download/DIR2_" + app.getSubmissionId() + ".pdf");
        generatedDocs.put("NOC", "http://localhost:8080/api/files/download/NOC_" + app.getSubmissionId() + ".pdf");

        return generatedDocs;
    }
}
