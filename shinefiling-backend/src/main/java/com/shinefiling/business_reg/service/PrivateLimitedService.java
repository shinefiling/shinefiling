package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import com.shinefiling.business_reg.repository.PrivateLimitedApplicationRepository;
import com.shinefiling.business_reg.util.PrivateLimitedDocGenerator;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.io.FileOutputStream;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class PrivateLimitedService {

    @Autowired
    private PrivateLimitedApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PrivateLimitedDocGenerator docGenerator;

    public PrivateLimitedApplication createApplication(PrivateLimitedApplication application, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        application.setUser(user);
        if (application.getSubmissionId() == null) {
            application.setSubmissionId("PVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Initial Status
        application.setStatus("DOCUMENT_GENERATION");
        application = applicationRepository.save(application);

        // Auto Generate Documents
        try {
            var docs = docGenerator.generateDocuments(application);
            application.setGeneratedDocuments(docs);
            application.setStatus("READY_FOR_FILING");
        } catch (Exception e) {
            e.printStackTrace();
            application.setStatus("GENERATION_FAILED");
        }

        return applicationRepository.save(application);
    }

    public List<PrivateLimitedApplication> getApplicationsByUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByUserId(user.getId());
    }

    public List<PrivateLimitedApplication> getAllApplications() {
        return applicationRepository.findAll();
    }

    public PrivateLimitedApplication getApplication(String submissionId) {
        return applicationRepository.findBySubmissionId(submissionId);
    }

    @Autowired
    private com.shinefiling.common.repository.ServiceRequestRepository serviceRequestRepository;

    public void markGovSubmitted(String submissionId, String srn) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            String status = "FILED_WITH_MCA";
            app.setStatus(status);
            app.setSrn(srn);
            applicationRepository.save(app);
            updateServiceRequestStatus(app.getServiceRequestId(), status);
        }
    }

    public void completeApplication(String submissionId, String certificatePath) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            String status = "APPROVED";
            app.setStatus(status);
            app.setCertificatePath(certificatePath);
            applicationRepository.save(app);
            updateServiceRequestStatus(app.getServiceRequestId(), status);
        }
    }

    public void raiseQuery(String submissionId, String query) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            String status = "QUERY_RAISED";
            app.setStatus(status);
            if (app.getDocumentRemarks() == null)
                app.setDocumentRemarks(new java.util.HashMap<>());
            app.getDocumentRemarks().put("General_Query", query);

            applicationRepository.save(app);
            updateServiceRequestStatus(app.getServiceRequestId(), status);
        }
    }

    private void updateServiceRequestStatus(Long serviceRequestId, String status) {
        if (serviceRequestId != null) {
            serviceRequestRepository.findById(serviceRequestId).ifPresent(req -> {
                req.setStatus(status);
                serviceRequestRepository.save(req);
            });
        }
    }

    public void rejectDocument(String submissionId, String docType, String reason) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            if (app.getDocumentRemarks() == null)
                app.setDocumentRemarks(new java.util.HashMap<>());
            if (app.getDocumentStatuses() == null)
                app.setDocumentStatuses(new java.util.HashMap<>());

            app.getDocumentRemarks().put(docType, reason);
            app.getDocumentStatuses().put(docType, "REJECTED");

            String status = "ACTION_REQUIRED";
            app.setStatus(status);
            applicationRepository.save(app);
            updateServiceRequestStatus(app.getServiceRequestId(), status);
        }
    }

    public void acceptDocument(String submissionId, String docType) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            if (app.getDocumentStatuses() == null)
                app.setDocumentStatuses(new java.util.HashMap<>());

            app.getDocumentStatuses().put(docType, "ACCEPTED");
            if (app.getDocumentRemarks() != null) {
                app.getDocumentRemarks().remove(docType);
            }
            applicationRepository.save(app);
            // No status change needed for single doc accept, or maybe check if all
            // accepted?
        }
    }

    public void verifyDocuments(String submissionId) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            String status = "DOCUMENTS_VERIFIED";
            app.setStatus(status);
            applicationRepository.save(app);
            updateServiceRequestStatus(app.getServiceRequestId(), status);
        }
    }

    public void generateStubDocuments(String submissionId) {
        PrivateLimitedApplication app = getApplication(submissionId);
        if (app != null) {
            java.util.Map<String, String> generatedDocs = new java.util.HashMap<>();

            try {
                Path dir = Paths.get("uploads/generated");
                if (!Files.exists(dir)) {
                    Files.createDirectories(dir);
                }

                java.util.List<String> docTypesList = new java.util.ArrayList<>(java.util.Arrays.asList(
                        "SPICe+ Part A", "SPICe+ Part B", "eMOA", "eAOA", "AGILE PRO", "INC-9", "DIR-2"));

                String plan = app.getPlanType() != null ? app.getPlanType().toUpperCase() : "STARTUP";

                if (plan.equals("GROWTH") || plan.equals("ENTERPRISE")) {
                    docTypesList.add("GST_Application_Data");
                    docTypesList.add("Udyam_Data_Sheet");
                    docTypesList.add("Bank_KYC_Pack");
                }

                if (plan.equals("ENTERPRISE")) {
                    docTypesList.add("Trademark_Authorization");
                    docTypesList.add("ADT-1_Draft");
                    docTypesList.add("INC-20A_Declaration");
                }

                String[] docTypes = docTypesList.toArray(new String[0]);

                for (String docType : docTypes) {
                    String cleanName = docType.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase() + "_" + submissionId
                            + ".pdf";
                    Path filePath = dir.resolve(cleanName);

                    // Generate VALID PDF using OpenPDF
                    Document document = new Document();
                    PdfWriter.getInstance(document, new FileOutputStream(filePath.toFile()));
                    document.open();
                    document.add(new Paragraph("SHINEFILING - GENERATED DOCUMENT"));
                    document.add(new Paragraph("------------------------------------------------"));
                    document.add(new Paragraph("Document Type: " + docType));
                    document.add(new Paragraph("Submission ID: " + submissionId));
                    document.add(new Paragraph("Date Generated: " + java.time.LocalDateTime.now()));
                    document.add(new Paragraph(
                            "\n\nThis is a placeholder document generated by the system for testing purposes."));
                    document.add(new Paragraph("\n\n(c) ShineFiling India"));
                    document.close();

                    // Store as relative path with leading slash as expected by AdminController
                    // locig
                    generatedDocs.put(docType, "/uploads/generated/" + cleanName);
                }

            } catch (IOException e) {
                e.printStackTrace();
            }

            app.setGeneratedDocuments(generatedDocs);

            String status = "DOCUMENTS_GENERATED";
            app.setStatus(status);
            applicationRepository.save(app);
            updateServiceRequestStatus(app.getServiceRequestId(), status);
        }
    }
}
