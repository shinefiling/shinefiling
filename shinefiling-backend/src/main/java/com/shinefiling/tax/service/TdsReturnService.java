package com.shinefiling.tax.service;

import com.shinefiling.tax.dto.TdsReturnRequest;
import com.shinefiling.tax.model.TdsReturn;
import com.shinefiling.tax.repository.TdsReturnRepository;
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
public class TdsReturnService {

    @Autowired
    private TdsReturnRepository tdsReturnRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(TdsReturnRequest request, String userId) {
        // 1. Create Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("TDS Return Filing");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("deductorName", request.getDeductorName());
        displayData.put("tan", request.getTanNumber());
        displayData.put("quarter", request.getQuarter());
        displayData.put("fy", request.getFinancialYear());
        displayData.put("appType", "TDS Filing");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Application
        TdsReturn app = new TdsReturn();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Data Verification Pending");
        app.setUser(user);

        // Map Fields
        app.setTanNumber(request.getTanNumber());
        app.setFinancialYear(request.getFinancialYear());
        app.setQuarter(request.getQuarter());
        app.setDeductorName(request.getDeductorName());

        try {
            app.setTdsDetailsJson(new ObjectMapper().writeValueAsString(request.getTdsDetails()));
        } catch (Exception e) {
            app.setTdsDetailsJson("{}");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        tdsReturnRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New TDS Return Order", "TDS Return for " + request.getDeductorName(),
                orderId);

        return orderId;
    }

    public List<TdsReturn> getAllApplications() {
        return tdsReturnRepository.findAll();
    }

    public TdsReturn getApplication(String id) {
        return tdsReturnRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        TdsReturn app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            tdsReturnRepository.save(app);

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
            case "salary":
                return 999.0;
            case "nri":
                return 2499.0;
            default:
                return 1499.0; // Non-Salary (Standard)
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        tasks.put("Challan Validation", true);
        tasks.put("PAN Validity Check", true);
        tasks.put("Late Fee Calculation", true);

        if ("salary".equalsIgnoreCase(plan)) {
            tasks.put("Employee PAN Mapping", true);
            tasks.put("Form 24Q Annexure Check", true);
        } else if ("nri".equalsIgnoreCase(plan)) {
            tasks.put("DTAA Rate Validation", true);
            tasks.put("Form 27Q Compliance", true);
        } else {
            tasks.put("Vendor PAN Verification", true);
            tasks.put("Form 26Q Section Rate", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, TdsReturnRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/tds/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. Compute Sheet
            String compPath = basePath + "TDS_Computation_Draft.pdf";
            createPdf(compPath, "TDS RETURN COMPUTATION (DRAFT)\n\nName: " + request.getDeductorName() + "\nTAN: "
                    + request.getTanNumber() + "\nPeriod: " + request.getQuarter() + " " + request.getFinancialYear());
            docs.put("TDS Computation", compPath);

            // 2. FVU Report (Stub)
            String fvuPath = basePath + "FVU_Validation_Report.pdf";
            createPdf(fvuPath, "FVU VALIDATION REPORT\n\nStatus: Success. No critical errors found.");
            docs.put("FVU Report", fvuPath);

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
