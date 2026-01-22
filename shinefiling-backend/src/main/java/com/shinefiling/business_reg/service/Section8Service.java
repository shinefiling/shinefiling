package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.Section8RegistrationRequest;
import com.shinefiling.business_reg.model.Section8Application;
import com.shinefiling.business_reg.repository.Section8Repository;
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
public class Section8Service {

    @Autowired
    private Section8Repository section8Repository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(Section8RegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Section 8 Company Registration");

        com.shinefiling.common.model.User user = null;
        if (userId != null) {
            user = userRepository.findById(Long.parseLong(userId)).orElse(null);
            serviceRequest.setUser(user);
        }

        serviceRequest.setStatus("Payment Received");
        serviceRequest.setPlan(request.getPlan());
        serviceRequest.setAmount(getPlanAmount(request.getPlan()));

        Map<String, Object> displayData = new HashMap<>();
        displayData.put("companyName", request.getNgoNameOption1());
        displayData.put("appType", "Section 8 NGO");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Section8 Application
        Section8Application app = new Section8Application();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        // Map Fields
        app.setNgoNameOption1(request.getNgoNameOption1());
        app.setNgoNameOption2(request.getNgoNameOption2());
        app.setObjectives(request.getObjectives());
        app.setRegisteredAddress(request.getRegisteredAddress());
        app.setBankPreference(request.getBankPreference());

        try {
            app.setDirectorsJson(new ObjectMapper().writeValueAsString(request.getDirectors()));
        } catch (Exception e) {
            app.setDirectorsJson("[]");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        section8Repository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New Section 8 Application",
                "New NGO Registration: " + request.getNgoNameOption1(), orderId);

        return orderId;
    }

    public List<Section8Application> getAllApplications() {
        return section8Repository.findAll();
    }

    public Section8Application getApplication(String id) {
        return section8Repository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        Section8Application app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            section8Repository.save(app);

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
            return 7999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 14999.0;
            case "premium":
                return 24999.0;
            default:
                return 7999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("Name Reservation (RUN)", true);
        tasks.put("MOA & AOA Drafted (Section 8 Format)", true);
        tasks.put("INC-12 License Application Ready", true);
        tasks.put("Incorporation (SPICe+) Ready", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("12A & 80G Documents Prep", true);
            tasks.put("CSR Eligibility Report", true);
            tasks.put("Bank Account Intro", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("12A & 80G Filing Data Ready", true);
            tasks.put("NGO Darpan Registration Data", true);
            tasks.put("CSR-1 Form Data", true);
            tasks.put("Compliance Calendar (1 Year)", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, Section8RegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/section8/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. MOA Draft
            String moaPath = basePath + "Draft_MOA.pdf";
            createPdf(moaPath, "MEMORANDUM OF ASSOCIATION\n\nName: " + request.getNgoNameOption1()
                    + "\nRank 1 Objective: No profit distribution.");
            docs.put("Draft MOA", moaPath);

            // 2. INC-12 Data
            String inc12Path = basePath + "INC12_Data.pdf";
            createPdf(inc12Path, "INC-12 LICENSE APPLICATION DATA\n\nProposed Name: " + request.getNgoNameOption1()
                    + "\nObjectives: " + request.getObjectives());
            docs.put("INC-12 Data", inc12Path);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                // Standard+
                String trustPath = basePath + "12A_80G_Prep.pdf";
                createPdf(trustPath, "12A & 80G PREPARATION GUIDE\n\nAttach Activity Note & Projections.");
                docs.put("12A 80G Prep Guide", trustPath);
            }

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                // Premium
                String darpanPath = basePath + "Darpan_Data.pdf";
                createPdf(darpanPath, "NGO DARPAN REGISTRATION DATA\n\nKey Officers: Check Director List.");
                docs.put("NGO Darpan Data", darpanPath);

                String csr1Path = basePath + "CSR1_Data.pdf";
                createPdf(csr1Path, "MCA CSR-1 FORM DATA\n\nEntity: Section 8 Company.");
                docs.put("CSR-1 Data", csr1Path);
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
