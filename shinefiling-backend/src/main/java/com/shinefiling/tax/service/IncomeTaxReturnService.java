package com.shinefiling.tax.service;

import com.shinefiling.tax.dto.IncomeTaxReturnRequest;
import com.shinefiling.tax.model.IncomeTaxReturn;
import com.shinefiling.tax.repository.IncomeTaxReturnRepository;
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
public class IncomeTaxReturnService {

    @Autowired
    private IncomeTaxReturnRepository incomeTaxReturnRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(IncomeTaxReturnRequest request, String userId) {
        // 1. Create Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Income Tax Return");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("applicantName", request.getApplicantName());
        displayData.put("pan", request.getPanNumber());
        displayData.put("ay", request.getAssessmentYear());
        displayData.put("appType", "ITR Filing");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Application
        IncomeTaxReturn app = new IncomeTaxReturn();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Data Verification Pending");
        app.setUser(user);

        // Map Fields
        app.setPanNumber(request.getPanNumber());
        app.setAssessmentYear(request.getAssessmentYear());
        app.setApplicantName(request.getApplicantName());

        try {
            app.setIncomeDetailsJson(new ObjectMapper().writeValueAsString(request.getIncomeDetails()));
        } catch (Exception e) {
            app.setIncomeDetailsJson("{}");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        incomeTaxReturnRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New ITR Order", "ITR for " + request.getApplicantName(), orderId);

        return orderId;
    }

    public List<IncomeTaxReturn> getAllApplications() {
        return incomeTaxReturnRepository.findAll();
    }

    public IncomeTaxReturn getApplication(String id) {
        return incomeTaxReturnRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        IncomeTaxReturn app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            incomeTaxReturnRepository.save(app);

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
            case "business":
                return 1999.0;
            case "capital_gains":
                return 2999.0;
            default:
                return 999.0; // Salaried
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        tasks.put("Tax Computation", true);
        tasks.put("TDS Reconciliation (26AS)", true);
        tasks.put("Deduction Optimization", true);

        if ("business".equalsIgnoreCase(plan)) {
            tasks.put("Balance Sheet Prep", true);
            tasks.put("P&L Summary", true);
        } else if ("capital_gains".equalsIgnoreCase(plan)) {
            tasks.put("Capital Gains Report", true);
            tasks.put("Foreign Asset Check", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, IncomeTaxReturnRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/itr/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. Computation Sheet
            String compPath = basePath + "Tax_Computation_Draft.pdf";
            createPdf(compPath, "INCOME TAX COMPUTATION (DRAFT)\n\nName: " + request.getApplicantName() + "\nPAN: "
                    + request.getPanNumber() + "\nAY: " + request.getAssessmentYear());
            docs.put("Tax Computation", compPath);

            // 2. ITR Draft
            String itrPath = basePath + "ITR_Draft.pdf";
            createPdf(itrPath, "ITR FORM DRAFT (VERIFICATION COPY)\n\nReview carefully before filing.");
            docs.put("ITR Draft", itrPath);

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
