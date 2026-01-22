package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.PartnershipRegistrationRequest;
import com.shinefiling.business_reg.model.PartnershipApplication;
import com.shinefiling.business_reg.repository.PartnershipRepository;
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
public class PartnershipService {

    @Autowired
    private PartnershipRepository partnershipRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private com.shinefiling.common.repository.UserRepository userRepository;

    @Transactional
    public String submitApplication(PartnershipRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Partnership Firm Registration");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("companyName", request.getFirmNameOption1());
        displayData.put("appType", "Partnership");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Partnership Application
        PartnershipApplication app = new PartnershipApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        app.setFirmNameOption1(request.getFirmNameOption1());
        app.setFirmNameOption2(request.getFirmNameOption2());
        app.setBusinessActivity(request.getBusinessActivity());
        app.setCapitalContribution(request.getCapitalContribution());
        app.setRegisteredAddress(request.getRegisteredAddress());
        app.setProfitSharingRatio(request.getProfitSharingRatio());

        // Standard/Premium
        app.setStateOfRegistration(request.getStateOfRegistration());
        app.setPlaceOfBusiness(request.getPlaceOfBusiness());
        app.setDateOfCommencement(request.getDateOfCommencement());

        // Premium
        app.setExpectedTurnover(request.getExpectedTurnover());
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

        partnershipRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New Partnership Registration",
                "New Partnership Application received: " + request.getFirmNameOption1(), orderId);

        return orderId;
    }

    public List<PartnershipApplication> getAllApplications() {
        return partnershipRepository.findAll();
    }

    public PartnershipApplication getApplication(String id) {
        return partnershipRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        PartnershipApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            partnershipRepository.save(app);

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
            return 2999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 5999.0;
            case "premium":
                return 8999.0;
            default:
                return 2999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("Partnership Deed Drafted", true);
        tasks.put("PAN Application Data Ready", true);
        tasks.put("Name Search Record Created", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("Registrar Application Data Ready", true);
            tasks.put("Final Partnership Deed Ready", true);
            tasks.put("Bank KYC Checklist Ready", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("GST Application Data Ready", true);
            tasks.put("MSME Application Data Ready", true);
            tasks.put("Compliance Calendar Generated", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, PartnershipRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/partnership/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. Partnership Deed Draft (All Plans)
            String deedPath = basePath + "Draft_Partnership_Deed.pdf";
            createPdf(deedPath,
                    "DRAFT PARTNERSHIP DEED\n\nThis Deed of Partnership is made on this day...\n\nBetween:\n"
                            + request.getFirmNameOption1());
            docs.put("Draft Partnership Deed", deedPath);

            // 2. PAN Application Data
            String panPath = basePath + "PAN_Application_Data.pdf";
            createPdf(panPath, "PAN APPLICATION DATA SHEET\n\nFirm Name: " + request.getFirmNameOption1());
            docs.put("PAN Application Data", panPath);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                String registrarPath = basePath + "Registrar_Form_Data.pdf";
                createPdf(registrarPath, "REGISTRAR OF FIRMS - FORM 1\n\nApplication for Registration of Firm\nState: "
                        + request.getStateOfRegistration());
                docs.put("Registrar Form Data", registrarPath);
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
