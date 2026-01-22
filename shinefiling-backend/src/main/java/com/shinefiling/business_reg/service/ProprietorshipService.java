package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.ProprietorshipRegistrationRequest;
import com.shinefiling.business_reg.model.ProprietorshipApplication;
import com.shinefiling.business_reg.repository.ProprietorshipRepository;
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
public class ProprietorshipService {

    @Autowired
    private ProprietorshipRepository proprietorshipRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(ProprietorshipRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Sole Proprietorship Registration");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("companyName", request.getBusinessNameOption1());
        displayData.put("appType", "Proprietorship");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Proprietorship Application
        ProprietorshipApplication app = new ProprietorshipApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        // Map Fields
        app.setBusinessNameOption1(request.getBusinessNameOption1());
        app.setBusinessNameOption2(request.getBusinessNameOption2());
        app.setBusinessType(request.getBusinessType());
        app.setBusinessAddress(request.getBusinessAddress());

        app.setProprietorName(request.getProprietorName());
        app.setEmail(request.getEmail());
        app.setMobile(request.getMobile());
        app.setPanNumber(request.getPanNumber());
        app.setAadhaarNumber(request.getAadhaarNumber());

        // Standard+
        app.setGstState(request.getGstState());
        app.setShopActState(request.getShopActState());

        // Premium
        app.setProfessionalTaxState(request.getProfessionalTaxState());
        app.setBankPreference(request.getBankPreference());

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        proprietorshipRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New Proprietorship Registration",
                "New Application: " + request.getBusinessNameOption1(), orderId);

        return orderId;
    }

    public List<ProprietorshipApplication> getAllApplications() {
        return proprietorshipRepository.findAll();
    }

    public ProprietorshipApplication getApplication(String id) {
        return proprietorshipRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        ProprietorshipApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            proprietorshipRepository.save(app);

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
            return 1999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 4999.0;
            case "premium":
                return 7999.0;
            default:
                return 1999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("Name Availability Check", true);
        tasks.put("Compliance Check Report", true);
        tasks.put("Bank Guidance Mail Drafted", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("GST Application Drafted", true);
            tasks.put("Shop Act Application Drafted", true);
            tasks.put("MSME Application Drafted", true);
            tasks.put("Bank Support Initiated", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("Professional Tax Reg Drafted", true);
            tasks.put("Current Account Application Ready", true);
            tasks.put("Invoice & Letterhead Generated", true);
            tasks.put("1-Year Compliance Calendar Set", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, ProprietorshipRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/proprietorship/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. Compliance Report (All Plans)
            String reportPath = basePath + "Compliance_Report.pdf";
            createPdf(reportPath, "COMPLIANCE REPORT\n\nBusiness Name: " + request.getBusinessNameOption1() + "\nType: "
                    + request.getBusinessType() + "\n\n1. Name Availability: Pending Check\n2. GST Applicability: "
                    + ("basic".equals(request.getPlan()) ? "Check Required" : "Included"));
            docs.put("Compliance Report", reportPath);

            // 2. Bank Guidance
            String bankPath = basePath + "Bank_Guidance.pdf";
            createPdf(bankPath, "BANK GUIDANCE DOCUMENT\n\nRecommended Banks for " + request.getBusinessType()
                    + " business:\n1. HDFC Bank\n2. ICICI Bank\n\nChecklist attached.");
            docs.put("Bank Guidance", bankPath);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                // Standard+ Stub Docs
                String gstPath = basePath + "GST_Draft.pdf";
                createPdf(gstPath, "GST REGISTRATION DRAFT\n\nState: " + request.getGstState());
                docs.put("GST Application Draft", gstPath);
            }

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                // Premium Stub Docs
                String invoicePath = basePath + "Invoice_Template.pdf";
                createPdf(invoicePath, "INVOICE TEMPLATE\n\n" + request.getBusinessNameOption1());
                docs.put("Invoice Template", invoicePath);

                String letterheadPath = basePath + "Letterhead_Template.pdf";
                createPdf(letterheadPath,
                        "LETTERHEAD\n\n" + request.getBusinessNameOption1() + "\n" + request.getBusinessAddress());
                docs.put("Letterhead Template", letterheadPath);
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
