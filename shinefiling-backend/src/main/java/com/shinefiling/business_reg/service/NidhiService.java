package com.shinefiling.business_reg.service;

import com.shinefiling.business_reg.dto.NidhiRegistrationRequest;
import com.shinefiling.business_reg.model.NidhiApplication;
import com.shinefiling.business_reg.repository.NidhiRepository;
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
public class NidhiService {

    @Autowired
    private NidhiRepository nidhiRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String submitApplication(NidhiRegistrationRequest request, String userId) {
        // 1. Create Generic Service Request
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setServiceName("Nidhi Company Registration");

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
        displayData.put("appType", "Nidhi Company");

        try {
            serviceRequest.setFormData(new ObjectMapper().writeValueAsString(displayData));
        } catch (Exception e) {
            serviceRequest.setFormData("{}");
        }

        serviceRequest = serviceRequestRepository.save(serviceRequest);
        String orderId = String.valueOf(serviceRequest.getId());

        // 2. Create Nidhi Application
        NidhiApplication app = new NidhiApplication();
        app.setServiceRequestId(orderId);
        app.setPlan(request.getPlan());
        app.setStatus("Payment Received");
        app.setUser(user);

        // Map Fields
        app.setCompanyNameOption1(request.getCompanyNameOption1());
        app.setCompanyNameOption2(request.getCompanyNameOption2());
        app.setAuthorizedCapital(request.getAuthorizedCapital());
        app.setRegisteredAddress(request.getRegisteredAddress());
        app.setBankPreference(request.getBankPreference());

        try {
            app.setDirectorsJson(new ObjectMapper().writeValueAsString(request.getDirectors()));
        } catch (Exception e) {
            app.setDirectorsJson("[]");
        }

        app.setAutomationTasks(generateAutomationTasks(request.getPlan()));
        app.setGeneratedDocuments(generateStubDocuments(orderId, request));

        nidhiRepository.save(app);

        // 4. Notify
        notificationService.notifyAdmins("ORDER", "New Nidhi Application",
                "New Nidhi Registration: " + request.getCompanyNameOption1(), orderId);

        return orderId;
    }

    public List<NidhiApplication> getAllApplications() {
        return nidhiRepository.findAll();
    }

    public NidhiApplication getApplication(String id) {
        return nidhiRepository.findByServiceRequestId(id).orElse(null);
    }

    public void updateStatus(String id, String status) {
        NidhiApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            nidhiRepository.save(app);

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
            return 12999.0;
        switch (plan.toLowerCase()) {
            case "standard":
                return 19999.0;
            case "premium":
                return 29999.0;
            default:
                return 12999.0;
        }
    }

    private Map<String, Boolean> generateAutomationTasks(String plan) {
        Map<String, Boolean> tasks = new HashMap<>();
        // Basic Tasks
        tasks.put("Name Reservation (RUN)", true);
        tasks.put("Nidhi MOA & AOA Drafted", true);
        tasks.put("Incorporation (SPICe+) Ready", true);

        if (!"basic".equalsIgnoreCase(plan)) {
            // Standard
            tasks.put("Loan Policy Draft", true);
            tasks.put("NDH-4 Data Preparation", true);
            tasks.put("Member Registers Format", true);
            tasks.put("Bank Account Intro", true);
        }
        if ("premium".equalsIgnoreCase(plan)) {
            // Premium
            tasks.put("NDH-1 Filing Data (90 Days)", true);
            tasks.put("First Board Resolution Draft", true);
            tasks.put("Statutory Registers Setup", true);
            tasks.put("Compliance Calendar (1 Year)", true);
        }
        return tasks;
    }

    private Map<String, String> generateStubDocuments(String orderId, NidhiRegistrationRequest request) {
        Map<String, String> docs = new HashMap<>();
        String basePath = "generated_docs/nidhi/" + orderId + "/";
        new File(basePath).mkdirs();

        try {
            // 1. MOA Draft
            String moaPath = basePath + "Draft_Nidhi_MOA.pdf";
            createPdf(moaPath,
                    "NIDHI MOA DRAFT\n\nName: " + request.getCompanyNameOption1() + "\nObject: Mutual Benefit Funds.");
            docs.put("Draft MOA", moaPath);

            // 2. AOA Draft
            String aoaPath = basePath + "Draft_Nidhi_AOA.pdf";
            createPdf(aoaPath, "NIDHI AOA DRAFT\n\nRules regarding deposits and loans.");
            docs.put("Draft AOA", aoaPath);

            if (!"basic".equalsIgnoreCase(request.getPlan())) {
                // Standard+
                String policyPath = basePath + "Loan_Policy_Draft.pdf";
                createPdf(policyPath, "NIDHI LOAN POLICY\n\n- Gold Loan Rules\n- Deposit Interest Rates");
                docs.put("Loan Policy Draft", policyPath);

                String ndh4Path = basePath + "NDH4_Prep_Data.pdf";
                createPdf(ndh4Path, "NDH-4 PREPARATION DATA\n\nMember count planning.");
                docs.put("NDH-4 Prep Data", ndh4Path);
            }

            if ("premium".equalsIgnoreCase(request.getPlan())) {
                // Premium
                String ndh1Path = basePath + "NDH1_Data.pdf";
                createPdf(ndh1Path, "NDH-1 COMPLIANCE DATA\n\nTo be filed within 90 days.\nNet Owned Funds Check.");
                docs.put("NDH-1 Data", ndh1Path);

                String resPath = basePath + "Board_Resolution.pdf";
                createPdf(resPath, "FIRST BOARD RESOLUTION\n\n- Open Bank Account\n-Appoint Auditor");
                docs.put("First Board Resolution", resPath);
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
