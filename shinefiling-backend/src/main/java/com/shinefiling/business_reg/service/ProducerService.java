package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.ProducerRegistrationRequest;
import com.shinefiling.business_reg.model.ProducerApplication;
import com.shinefiling.business_reg.repository.ProducerRepository;
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
public class ProducerService {

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(ProducerRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Producer Company Registration");

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
        displayData.put("appType", "Producer Company (FPO)");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Producer Application
        ProducerApplication app = new ProducerApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        // Map Fields
        app.setCompanyNameOption1(request.getCompanyNameOption1());
        app.setCompanyNameOption2(request.getCompanyNameOption2());
        app.setActivityType(request.getActivityType());
        app.setRegisteredAddress(request.getRegisteredAddress());
        app.setNumberOfProducers(request.getNumberOfProducers());

        try {
            app.setDirectorsJson(new ObjectMapper().writeValueAsString(request.getDirectors()));
        } catch (Exception e) {
            app.setDirectorsJson("[]");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        producerRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New FPO Application",
                "New Producer Company Registration: " + request.getCompanyNameOption1(), orderId);

        return orderId;
    }

    public List<ProducerApplication> getAllApplications() {
        return producerRepository.findAll();
    }

    public ProducerApplication getApplication(String id) {
        return producerRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        ProducerApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            producerRepository.save(app);

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
            return 14999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 24999.0;
            case "premium":
                return 39999.0;
            default:
                return 14999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("Name Reservation (Producer Suffix)", true);
        tasks.put("Producer MOA & AOA Drafted", true);
        tasks.put("Incorporation Ready", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("First Board Resolution Draft", true);
            tasks.put("Bank Account Intro", true);
            tasks.put("Additional DSC Processing", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("Member Register Format", true);
            tasks.put("Share Register Format", true);
            tasks.put("FPO Compliance Guide", true);
            tasks.put("Annual Filing Guidance (AOC-4/MGT-7)", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, ProducerRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/producer/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. MOA Draft
            String moaPath = basePath + "Draft_Producer_MOA.pdf";
            createPdf(moaPath, "PRODUCER MOA DRAFT\n\nName: " + request.getCompanyNameOption1() + "\nActivity: "
                    + request.getActivityType());
            docs.put("Draft MOA", moaPath);

            // 2. AOA Draft
            String aoaPath = basePath + "Draft_Producer_AOA.pdf";
            createPdf(aoaPath, "PRODUCER AOA DRAFT\n\nPatronage Bonus Rules & Voting Rights.");
            docs.put("Draft AOA", aoaPath);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                // Standard+
                String resPath = basePath + "First_Board_Resolution.pdf";
                createPdf(resPath, "FIRST BOARD RESOLUTION\n\n- Open Bank Account\n- Allot Shares");
                docs.put("First Board Resolution", resPath);
            }

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                // Premium
                String regPath = basePath + "Producer_Registers.pdf";
                createPdf(regPath, "STATUTORY REGISTERS TEMPLATE\n\n- Member Register\n- Share Register");
                docs.put("Producer Registers", regPath);

                String guidePath = basePath + "FPO_Compliance_Guide.pdf";
                createPdf(guidePath, "FPO COMPLIANCE GUIDE\n\n- Annual General Meeting\n- Govt Subsidies");
                docs.put("FPO Compliance Guide", guidePath);
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
