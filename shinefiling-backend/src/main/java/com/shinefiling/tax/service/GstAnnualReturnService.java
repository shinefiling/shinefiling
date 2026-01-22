package com.shinefiling.tax.service;

import com.shinefiling.tax.dto.GstAnnualReturnRequest;
import com.shinefiling.tax.model.GstAnnualReturn;
import com.shinefiling.tax.repository.GstAnnualReturnRepository;
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
public class GstAnnualReturnService {

    @Autowired
    private GstAnnualReturnRepository gstAnnualReturnRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(GstAnnualReturnRequest request, String userId) {
        // 1. Create Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("GST Annual Return");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("gstin", request.getGstin());
        displayData.put("financialYear", request.getFinancialYear());
        displayData.put("appType", "GST Annual Return");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Application
        GstAnnualReturn app = new GstAnnualReturn();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Data Review Pending");
        app.setUser(user);

        // Map Fields
        app.setGstin(request.getGstin());
        app.setFinancialYear(request.getFinancialYear());
        app.setNilReturn(request.isNilReturn());

        app.setGstr9Status("Pending");
        app.setGstr9cStatus("premium".equalsIgnoreCase(request.getPlan()) ? "Pending" : "NA");

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        gstAnnualReturnRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New GSTR-9 Order", "Annual Return for " + request.getFinancialYear(),
                orderId);

        return orderId;
    }

    public List<GstAnnualReturn> getAllApplications() {
        return gstAnnualReturnRepository.findAll();
    }

    public GstAnnualReturn getApplication(String id) {
        return gstAnnualReturnRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        GstAnnualReturn app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            gstAnnualReturnRepository.save(app);

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
            return 1499.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 2999.0;
            case "premium":
                return 5999.0;
            default:
                return 1499.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("GSTR-9 Draft", true);
        tasks.put("Turnover Validation", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("Detailed Reconciliation", true);
            tasks.put("ITC Mismatch Check", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("Audit Report (9C) Prep", true);
            tasks.put("CA Certification", true);
            tasks.put("Books vs Return Match", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, GstAnnualReturnRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/gst_annual/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. GSTR-9 Draft
            String g9Path = basePath + "GSTR9_Draft.pdf";
            createPdf(g9Path, "GSTR-9 ANNUAL RETURN DRAFT\n\nGSTIN: " + request.getGstin() + "\nFY: "
                    + request.getFinancialYear());
            docs.put("GSTR-9 Draft", g9Path);

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                String g9cPath = basePath + "GSTR9C_Audit_Report.pdf";
                createPdf(g9cPath, "GSTR-9C RECONCILIATION STATEMENT\n\nAuditor: CA Verified");
                docs.put("GSTR-9C Report", g9cPath);
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
