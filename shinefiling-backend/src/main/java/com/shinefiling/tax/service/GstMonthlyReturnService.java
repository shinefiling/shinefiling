package com.shinefiling.tax.service;

import com.shinefiling.tax.dto.GstMonthlyReturnRequest;
import com.shinefiling.tax.model.GstMonthlyReturn;
import com.shinefiling.tax.repository.GstMonthlyReturnRepository;
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
public class GstMonthlyReturnService {

    @Autowired
    private GstMonthlyReturnRepository gstMonthlyReturnRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(GstMonthlyReturnRequest request, String userId) {
        // 1. Create Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("GST Monthly Return");

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
        displayData.put("period", request.getFilingMonth() + " " + request.getFilingYear());
        displayData.put("appType", "GST Return");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Application
        GstMonthlyReturn app = new GstMonthlyReturn();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Data Pending Review"); // Initial Status
        app.setUser(user);

        // Map Fields
        app.setGstin(request.getGstin());
        app.setFilingMonth(request.getFilingMonth());
        app.setFilingYear(request.getFilingYear());
        app.setNilReturn(request.isNilReturn());
        app.setTurnoverAmount(request.getTurnoverAmount());

        app.setGstr1Status("Pending");
        app.setGstr3bStatus("Pending");

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        gstMonthlyReturnRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New GST Return", "GST Return for " + request.getFilingMonth(),
                orderId);

        return orderId;
    }

    public List<GstMonthlyReturn> getAllApplications() {
        return gstMonthlyReturnRepository.findAll();
    }

    public GstMonthlyReturn getApplication(String id) {
        return gstMonthlyReturnRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        GstMonthlyReturn app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            gstMonthlyReturnRepository.save(app);

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
            case "nil":
                return 499.0;
            case "standard":
                return 999.0;
            case "premium":
                return 1999.0;
            default:
                return 999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("GSTR-1 Check", true);
        tasks.put("GSTR-3B Check", true);

        if (!"nil".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("B2B Invoice Validation", true);
            tasks.put("ITC Eligibility Calc", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("2A/2B Reconciliation", true);
            tasks.put("Mismatch Report Gen", true);
            tasks.put("CA Review", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, GstMonthlyReturnRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/gst_returns/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. Calculation Sheet
            String calcPath = basePath + "Tax_Calculation_Sheet_Draft.pdf";
            createPdf(calcPath, "TAX CALCULATION SHEET\n\nGSTIN: " + request.getGstin() + "\nPeriod: "
                    + request.getFilingMonth() + "\n\nTax Payable: To be calculated.");
            docs.put("Calculation Sheet", calcPath);

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                String reconPath = basePath + "Reconciliation_Report.pdf";
                createPdf(reconPath, "GSTR-2B VS PURCHASE RECONCILIATION\n\nMatching: 100%");
                docs.put("Reconciliation Report", reconPath);
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
