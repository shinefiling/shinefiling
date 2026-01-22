package com.shinefiling.tax.service;

import com.shinefiling.tax.dto.GstRegistrationRequest;
import com.shinefiling.tax.model.GstApplication;
import com.shinefiling.tax.repository.GstRepository;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.NotificationService;
import com.shinefiling.common.repository.UserRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GstService {

    @Autowired
    private GstRepository gstRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(GstRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("GST Registration");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("tradeName", request.getTradeName());
        displayData.put("appType", "GST Registration");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create GST Application
        GstApplication app = new GstApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        // Map Fields
        app.setTradeName(request.getTradeName());
        app.setLegalName(request.getLegalName());
        app.setBusinessType(request.getBusinessType());
        app.setNatureOfBusiness(request.getNatureOfBusiness());
        app.setBusinessAddress(request.getBusinessAddress());
        app.setTurnoverEstimate(request.getTurnoverEstimate());
        app.setPan(request.getPan());
        app.setAadhaar(request.getAadhaar());

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        gstRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New GST App", "New GST Registration: " + request.getTradeName(),
                orderId);

        return orderId;
    }

    public List<GstApplication> getAllApplications() {
        return gstRepository.findAll();
    }

    public GstApplication getApplication(String id) {
        return gstRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        GstApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            gstRepository.save(app);

            Optional<ServiceRequest> sr = serviceRequestRepository.findById(Long.parseLong(id));
            if (sr.isPresent()) {
                ServiceRequest s = sr.get();
                s.setStatus(status);
                serviceRequestRepository.save(s);
            }
        }
    }

    private double getPlanAmount(String plan) {
        if (plan == null)
            return 999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 1499.0;
            case "premium":
                return 2999.0;
            default:
                return 999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("GST REG-01 Draft", true);
        tasks.put("Aadhaar Auth Link Ready", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("Document Verification Check", true);
            tasks.put("ARN Tracking Enable", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("Billing Software Access", true);
            tasks.put("3-Month Return Schedule", true);
            tasks.put("CA Assignment", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, GstRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/gst/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. App Summary
            String sumPath = basePath + "GST_App_Summary.pdf";
            createPdf(sumPath,
                    "GST APPLICATION SUMMARY\n\nTrade Name: " + request.getTradeName() + "\nPAN: " + request.getPan());
            docs.put("App Summary", sumPath);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                // Standard+
                String arnPath = basePath + "ARN_Acknowledgement_Draft.pdf";
                createPdf(arnPath, "ARN ACKNOWLEDGEMENT (DRAFT)\n\nSubmitted on Portal.");
                docs.put("ARN Draft", arnPath);
            }

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                // Premium
                String invPath = basePath + "Invoice_Format.pdf";
                createPdf(invPath, "GST INVOICE FORMAT\n\n- Tax Invoice\n- Bill of Supply");
                docs.put("Invoice Format", invPath);

                String guidePath = basePath + "GST_Return_Guide.pdf";
                createPdf(guidePath, "GST RETURN GUIDE\n\nGSTR-1 (Sales) & GSTR-3B (Payment).");
                docs.put("Return Guide", guidePath);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return docs;
    }

    private void createPdf(String path, String content) {
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(path));
            document.open();
            document.add(new Paragraph(content));
            document.close();
        } catch (Exception e) {
            // Stub
        }
    }
}
