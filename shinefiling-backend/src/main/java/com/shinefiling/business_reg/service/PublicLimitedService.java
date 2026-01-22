package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.PublicLimitedRegistrationRequest;
import com.shinefiling.business_reg.model.PublicLimitedApplication;
import com.shinefiling.business_reg.repository.PublicLimitedRepository;
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
public class PublicLimitedService {

    @Autowired
    private PublicLimitedRepository publicLimitedRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(PublicLimitedRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Public Limited Company Registration");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("companyName", request.getCompanyNameOption1());
        displayData.put("appType", "Public Limited Company");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Public Limited Application
        PublicLimitedApplication app = new PublicLimitedApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        // Map Fields
        app.setCompanyNameOption1(request.getCompanyNameOption1());
        app.setCompanyNameOption2(request.getCompanyNameOption2());
        app.setBusinessActivity(request.getBusinessActivity());
        app.setRegisteredAddress(request.getRegisteredAddress());
        app.setAuthorizedCapital(request.getAuthorizedCapital());
        app.setNumberOfShareholders(request.getNumberOfShareholders());

        try {
            app.setDirectorsJson(new ObjectMapper().writeValueAsString(request.getDirectors()));
        } catch (Exception e) {
            app.setDirectorsJson("[]");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        publicLimitedRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New Public Limited App",
                "New Public Limited Registration: " + request.getCompanyNameOption1(), orderId);

        return orderId;
    }

    public List<PublicLimitedApplication> getAllApplications() {
        return publicLimitedRepository.findAll();
    }

    public PublicLimitedApplication getApplication(String id) {
        return publicLimitedRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        PublicLimitedApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            publicLimitedRepository.save(app);

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
            return 19999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 34999.0;
            case "premium":
                return 59999.0;
            default:
                return 19999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("Name Reservation (Limited)", true);
        tasks.put("Public MOA & AOA Drafted", true);
        tasks.put("Incorporation (SPICe+) Ready", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("First Board Resolution Draft", true);
            tasks.put("Share Certificates Draft", true);
            tasks.put("Bank Account Intro", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("Statutory Registers Setup", true);
            tasks.put("Auditor Appointment (ADT-1)", true);
            tasks.put("Compliance Calendar (1 Year)", true);
            tasks.put("ROC Filing Guide (AOC-4/MGT-7)", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, PublicLimitedRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/public_limited/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. MOA Draft
            String moaPath = basePath + "Public_MOA_Draft.pdf";
            createPdf(moaPath, "PUBLIC LIMITED MOA\n\nName: " + request.getCompanyNameOption1() + "\nCapital: "
                    + request.getAuthorizedCapital());
            docs.put("Draft MOA", moaPath);

            // 2. AOA Draft
            String aoaPath = basePath + "Public_AOA_Draft.pdf";
            createPdf(aoaPath, "PUBLIC LIMITED AOA\n\nShare Transferability Rules.");
            docs.put("Draft AOA", aoaPath);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                // Standard+
                String resPath = basePath + "First_Board_Resolution.pdf";
                createPdf(resPath, "FIRST BOARD RESOLUTION\n\n- Open Bank Account\n- Issue Shares");
                docs.put("First Board Resolution", resPath);

                String certPath = basePath + "Share_Certificates_Template.pdf";
                createPdf(certPath, "SHARE CERTIFICATE TEMPLATE\n\nFolio No: \nCertificate No:");
                docs.put("Share Certificates", certPath);
            }

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                // Premium
                String regPath = basePath + "Statutory_Registers.pdf";
                createPdf(regPath, "STATUTORY REGISTERS\n\n- Register of Members (MGT-1)\n- Register of Directors");
                docs.put("Statutory Registers", regPath);

                String adtPath = basePath + "Auditor_ADT1_Draft.pdf";
                createPdf(adtPath, "ADT-1 DRAFT\n\nAppointment of Statutory Auditor.");
                docs.put("ADT-1 Draft", adtPath);
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
