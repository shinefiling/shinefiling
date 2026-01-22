package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.LlpRegistrationRequest;
import com.shinefiling.business_reg.model.LlpApplication;
import com.shinefiling.business_reg.repository.LlpRepository;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.NotificationService;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileOutputStream;
import java.io.File;
import java.util.*;

@Service
public class LlpService {

    @Autowired
    private LlpRepository llpRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.shinefiling.common.repository.UserRepository userRepository;

    @Transactional
    public String submitApplication(LlpRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Limited Liability Partnership"); // Correct field name

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("companyName", request.getLlpNameOption1());
        displayData.put("appType", "LLP");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create LLP Application
        LlpApplication app = new LlpApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user); // Set User relation

        app.setLlpNameOption1(request.getLlpNameOption1());
        app.setLlpNameOption2(request.getLlpNameOption2());
        app.setBusinessActivity(request.getBusinessActivity());
        app.setContributionAmount(request.getContributionAmount());
        app.setRegisteredAddress(request.getRegisteredAddress());

        app.setProfitSharingRatio(request.getProfitSharingRatio());
        app.setTurnoverEstimate(request.getTurnoverEstimate());
        app.setGstState(request.getGstState());
        app.setBankPreference(request.getBankPreference());
        app.setAccountingStartDate(request.getAccountingStartDate());

        try {
            app.setPartnersJson(new ObjectMapper().writeValueAsString(request.getPartners()));
        } catch (Exception e) {
            app.setPartnersJson("[]");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        llpRepository.save(app);

        // 4. Notify
        // notificationService.notifyAdmins("ADMIN", "New LLP Registration", "New LLP
        // Application: " + request.getLlpNameOption1(), orderId);
        // Using correct generic method for now if notifyAdmins is not fully reliable or
        // if we want specific type
        notificationService.notifyAdmins("ORDER", "New LLP Application",
                "New LLP Registration received: " + request.getLlpNameOption1(), orderId);

        return orderId;
    }

    public List<LlpApplication> getAllApplications() {
        return llpRepository.findAll();
    }

    public LlpApplication getApplication(String id) {
        return llpRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        LlpApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            llpRepository.save(app);

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
            return 4999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 8999.0;
            case "premium":
                return 12999.0;
            default:
                return 4999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        tasks.put("LLP Agreement Generated", true);
        tasks.put("Partner Consent Forms Ready", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            tasks.put("Partner Allocation (PAN/TAN)", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            tasks.put("GST Application Drafted", true);
            tasks.put("MSME Application Drafted", true);
            tasks.put("Bank Account Request Initiated", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, LlpRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/llp/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            String agreePath = basePath + "Draft_LLP_Agreement.pdf";
            createPdf(agreePath, "LLP AGREEMENT DRAFT\n\nFor: " + request.getLlpNameOption1());
            docs.put("Draft LLP Agreement", agreePath);

            String consentPath = basePath + "Partner_Consent.pdf";
            createPdf(consentPath, "PARTNER CONSENT FORM\n\nWe hereby consent to act as Designated Partners.");
            docs.put("Partner Consent Form", consentPath);

            String fillipPath = basePath + "FiLLiP_Form_Data.pdf";
            createPdf(fillipPath, "FiLLiP FORM DATA SHEET\n\nContribution: " + request.getContributionAmount());
            docs.put("FiLLiP Data Sheet", fillipPath);

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
