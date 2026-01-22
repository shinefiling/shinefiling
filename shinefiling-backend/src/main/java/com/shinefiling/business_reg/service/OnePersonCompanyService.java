package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.model.OnePersonCompanyApplication;
import com.shinefiling.business_reg.repository.OnePersonCompanyRepository;
import com.shinefiling.common.model.User;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.FileOutputStream;
import com.lowagie.text.Document;

import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OnePersonCompanyService {

    @Autowired
    private OnePersonCompanyRepository opcRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public OnePersonCompanyApplication createApplication(OnePersonCompanyApplication app, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        app.setUser(user);
        app.setStatus("PAYMENT_SUCCESSFUL");

        // Initial Document Statuses
        Map<String, String> statusMap = new HashMap<>();
        statusMap.put("PAN_CARD", "PENDING");
        statusMap.put("AADHAAR_CARD", "PENDING");
        statusMap.put("PHOTO", "PENDING");
        if (app.getUploadedDocuments() != null) {
            app.getUploadedDocuments().keySet().forEach(key -> statusMap.put(key, "PENDING"));
        }
        app.setDocumentStatuses(statusMap);

        OnePersonCompanyApplication saved = opcRepository.save(app);

        // Auto Generate Documents (Stub)
        try {
            generateStubDocuments(saved.getSubmissionId());
        } catch (Exception e) {
            e.printStackTrace();
        }

        return saved;
    }

    public void generateStubDocuments(String submissionId) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        if (app == null)
            return;

        List<String> docTypes = new ArrayList<>();
        docTypes.add("eMOA");
        docTypes.add("eAOA");
        docTypes.add("INC-9");
        docTypes.add("DIR-2");
        docTypes.add("Nominee_Consent_Form"); // INC-3 Draft

        String plan = app.getPlanType() != null ? app.getPlanType().toUpperCase() : "BASIC";

        if ("STANDARD".equals(plan) || "PREMIUM".equals(plan)) {
            docTypes.add("Share_Certificate_Draft");
            docTypes.add("GST_Application_Data");
            docTypes.add("Bank_KYC_Pack");
        }

        if ("PREMIUM".equals(plan)) {
            docTypes.add("MSME_Application_Data");
            docTypes.add("Board_Resolution_Draft");
            docTypes.add("Compliance_Calendar");
        }

        Map<String, String> generatedDocs = new HashMap<>();
        if (app.getGeneratedDocuments() != null) {
            generatedDocs.putAll(app.getGeneratedDocuments());
        }

        try {
            Path dir = Paths.get("uploads/generated");
            if (!Files.exists(dir)) {
                Files.createDirectories(dir);
            }

            for (String docType : docTypes) {
                String cleanName = docType.replaceAll("[^a-zA-Z0-9]", "_").toLowerCase() + "_" + submissionId + ".pdf";
                Path filePath = dir.resolve(cleanName);

                // Generate VALID PDF using OpenPDF
                Document document = new Document();
                PdfWriter.getInstance(document, new FileOutputStream(filePath.toFile()));
                document.open();
                document.add(new Paragraph("SHINEFILING - OPC GENERATED DOCUMENT"));
                document.add(new Paragraph("------------------------------------------------"));
                document.add(new Paragraph("Document Type: " + docType));
                document.add(new Paragraph("Submission ID: " + submissionId));
                document.add(new Paragraph("Date: " + java.time.LocalDateTime.now()));
                document.add(new Paragraph("\n\nThis is a placeholder document for OPC Registration."));
                document.close();

                generatedDocs.put(docType, "/uploads/generated/" + cleanName);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        app.setGeneratedDocuments(generatedDocs);
        opcRepository.save(app);
    }

    public OnePersonCompanyApplication getApplication(String submissionId) {
        return opcRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public List<OnePersonCompanyApplication> getAllApplications() {
        return opcRepository.findAll();
    }

    public void updateStatus(String submissionId, String status) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        app.setStatus(status);
        opcRepository.save(app);

        // Notify User
        try {
            notificationService.createNotification(
                    app.getUser(),
                    "ORDER_UPDATE",
                    "OPC Application Status: " + status,
                    "Your One Person Company registration status has been updated to " + status,
                    app.getSubmissionId(),
                    "OPC_APPLICATION");
        } catch (Exception e) {
            System.err.println("Notification failed: " + e.getMessage());
        }
    }

    public void acceptDocument(String submissionId, String docType) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        Map<String, String> statuses = app.getDocumentStatuses();
        if (statuses == null)
            statuses = new HashMap<>();
        statuses.put(docType, "ACCEPTED");
        app.setDocumentStatuses(statuses);
        opcRepository.save(app);
    }

    public void rejectDocument(String submissionId, String docType, String reason) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        Map<String, String> statuses = app.getDocumentStatuses();
        if (statuses == null)
            statuses = new HashMap<>();
        statuses.put(docType, "REJECTED");
        app.setDocumentStatuses(statuses);

        Map<String, String> remarks = app.getDocumentRemarks();
        if (remarks == null)
            remarks = new HashMap<>();
        remarks.put(docType, reason);
        app.setDocumentRemarks(remarks);

        app.setStatus("ACTION_REQUIRED");
        opcRepository.save(app);

        // Notify
        notificationService.createNotification(
                app.getUser(),
                "ACTION_REQUIRED",
                "Document Rejected: " + docType,
                "Reason: " + reason + ". Please re-upload.",
                app.getSubmissionId(),
                "OPC_APPLICATION");
    }

    public void markGovSubmitted(String submissionId, String srn) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        app.setSrn(srn);
        app.setStatus("FILED_WITH_GOVT");
        opcRepository.save(app);
    }

    public void completeApplication(String submissionId, String certificateUrl) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        app.setCertificatePath(certificateUrl);
        app.setStatus("COMPLETED");
        opcRepository.save(app);

        // Notify
        notificationService.createNotification(
                app.getUser(),
                "CONGRATULATIONS",
                "Company Incorporated!",
                "Your One Person Company has been successfully incorporated.",
                app.getSubmissionId(),
                "OPC_APPLICATION");
    }

    public void verifyDocuments(String submissionId) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        // Logic to mark all uploaded docs as VERIFIED or move status to
        // VERIFICATION_IN_PROGRESS
        app.setStatus("VERIFICATION_IN_PROGRESS");
        opcRepository.save(app);
    }

    public void raiseQuery(String submissionId, String query) {
        OnePersonCompanyApplication app = getApplication(submissionId);
        app.setStatus("QUERY_RAISED");
        // We might want to store the query string specifically
        notificationService.createNotification(
                app.getUser(),
                "QUERY_RAISED",
                "Clarification Needed",
                query,
                app.getSubmissionId(),
                "OPC_APPLICATION");
        opcRepository.save(app);
    }
}
