package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.OnePersonCompanyRegistrationRequest;
import com.shinefiling.business_reg.model.OnePersonCompanyApplication;
import com.shinefiling.business_reg.service.OnePersonCompanyService;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.NotificationService;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/one-person-company")
@CrossOrigin(origins = "http://localhost:5173")
public class OnePersonCompanyController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private OnePersonCompanyService opcService;

    @Autowired
    private NotificationService notificationService;

    private static final String SERVICE_NAME = "One Person Company Registration";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody OnePersonCompanyRegistrationRequest requestDTO) {
        try {
            // 1. Extract Details
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // 2. Generate Plan-Based Automation Tasks
            List<OnePersonCompanyRegistrationRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan);
            requestDTO.setAutomationQueue(tasks);

            // 3. Set Status
            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");
            }

            // 4. Serialize to JSON for Storage in 'formData'
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);

            // 5. Create Generic Service Request
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);
            createdRequest.setPlan(plan.toUpperCase());

            if (requestDTO.getAmountPaid() != null) {
                createdRequest.setAmount(requestDTO.getAmountPaid());
            } else {
                createdRequest.setAmount(getPlanAmount(plan));
            }

            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

            // Notifications
            try {
                notificationService.notifyAdmins("ORDER", "New OPC Registration", "New OPC application from " + email,
                        createdRequest.getId().toString());
                if (createdRequest.getUser() != null) {
                    notificationService.createNotification(createdRequest.getUser(), "ORDER_UPDATE",
                            "Application Received",
                            "Your OPC registration has been received. Order ID: " + createdRequest.getId(),
                            createdRequest.getId().toString(), "SERVICE_REQUEST");
                }
            } catch (Exception e) {
                System.err.println("Notification Error: " + e.getMessage());
            }

            serviceRequestRepository.save(createdRequest);

            // 6. Create Specialized OPC Application Entity
            try {
                OnePersonCompanyApplication opcApp = new OnePersonCompanyApplication();
                opcApp.setServiceRequestId(createdRequest.getId());
                opcApp.setSubmissionId(requestDTO.getSubmissionId());
                opcApp.setPlanType(plan);
                opcApp.setStatus("PAYMENT_SUCCESSFUL");
                opcApp.setAmountPaid(createdRequest.getAmount());

                if (requestDTO.getFormData() != null) {
                    OnePersonCompanyRegistrationRequest.OpcFormData formData = requestDTO.getFormData();
                    opcApp.setProposedNames(formData.getCompanyNames());
                    opcApp.setBusinessActivity(formData.getBusinessActivity());
                    opcApp.setRegisteredAddress(formData.getAddressLine1() + ", " + formData.getDistrict() + ", "
                            + formData.getState() + " - " + formData.getPincode());
                    opcApp.setAuthorizedCapital(formData.getAuthorizedCapital());
                    opcApp.setPaidUpCapital(formData.getPaidUpCapital());

                    // Director Mapping
                    if (formData.getDirector() != null) {
                        OnePersonCompanyRegistrationRequest.DirectorDTO d = formData.getDirector();
                        opcApp.setDirectorName(d.getName());
                        opcApp.setDirectorEmail(d.getEmail());
                        opcApp.setDirectorMobile(d.getPhone());
                        opcApp.setDirectorPan(d.getPan());
                        opcApp.setDirectorAadhaar(d.getAadhaar());
                    }

                    // Nominee Mapping
                    if (formData.getNominee() != null) {
                        OnePersonCompanyRegistrationRequest.NomineeDTO n = formData.getNominee();
                        opcApp.setNomineeName(n.getName());
                        opcApp.setNomineeRelationship(n.getRelationship());
                        opcApp.setNomineePan(n.getPan());
                        opcApp.setNomineeAadhaar(n.getAadhaar());
                        opcApp.setNomineeEmail(formData.getDirector().getEmail()); // Usually same contact for updates
                                                                                   // or nominee specific
                        // Assuming Nominee Email/Mobile might be needed, for now defaulting or leaving
                        // null if not in DTO specifically for contact
                    }

                    // Plan Specifics
                    opcApp.setBankPreference(formData.getBankPreference());
                    opcApp.setTurnoverEstimate(formData.getTurnoverEstimate());
                    opcApp.setAccountingStartDate(formData.getAccountingStartDate());
                }

                if (requestDTO.getDocuments() != null) {
                    java.util.Map<String, String> docMap = new java.util.HashMap<>();
                    for (OnePersonCompanyRegistrationRequest.UploadedDocumentDTO doc : requestDTO.getDocuments()) {
                        docMap.put(doc.getId(), doc.getFileUrl());
                    }
                    opcApp.setUploadedDocuments(docMap);
                }

                opcService.createApplication(opcApp, email);

            } catch (Exception ex) {
                ex.printStackTrace();
            }

            return ResponseEntity.ok(createdRequest);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- ADMIN ACTIONS ---

    @PostMapping("/{submissionId}/verify-docs")
    public ResponseEntity<?> verifyDocs(@PathVariable String submissionId) {
        opcService.verifyDocuments(submissionId);
        return ResponseEntity.ok(Map.of("message", "Documents Verified"));
    }

    @PostMapping("/{submissionId}/generate-docs")
    public ResponseEntity<?> generateDocs(@PathVariable String submissionId) {
        opcService.generateStubDocuments(submissionId);
        return ResponseEntity.ok(Map.of("message", "Documents Generated"));
    }

    @PostMapping("/{submissionId}/gov-submission")
    public ResponseEntity<?> markGovSubmitted(@PathVariable String submissionId, @RequestParam String srn) {
        opcService.markGovSubmitted(submissionId, srn);
        return ResponseEntity.ok(Map.of("message", "Marked as Filed"));
    }

    @PostMapping("/{submissionId}/upload-certificate")
    public ResponseEntity<?> uploadCertificate(@PathVariable String submissionId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String fileUrl = "http://localhost:8080/uploads/" + file.getOriginalFilename(); // Mock
        opcService.completeApplication(submissionId, fileUrl);
        return ResponseEntity.ok(Map.of("message", "Certificate Uploaded"));
    }

    @PostMapping("/{submissionId}/accept-doc")
    public ResponseEntity<?> acceptDoc(@PathVariable String submissionId, @RequestParam String docType) {
        opcService.acceptDocument(submissionId, docType);
        return ResponseEntity.ok(Map.of("message", "Document Accepted"));
    }

    @PostMapping("/{submissionId}/reject-doc")
    public ResponseEntity<?> rejectDoc(@PathVariable String submissionId, @RequestBody Map<String, String> payload) {
        opcService.rejectDocument(submissionId, payload.get("docType"), payload.get("reason"));
        return ResponseEntity.ok(Map.of("message", "Document Rejected"));
    }

    // --- HELPERS ---

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 4999.0;
            case "standard":
                return 8999.0;
            case "premium":
                return 12999.0;
            default:
                return 4999.0;
        }
    }

    private List<OnePersonCompanyRegistrationRequest.AutomationTaskDTO> generateAutomationTasks(String plan) {
        List<OnePersonCompanyRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Basic
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify KYC & Address Proofs", "HIGH");
        addTask(tasks, "DSC_DIN_APPLICATION", "Apply for DSC & DIN for Director", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "File RUN Service for Name", "MEDIUM");
        addTask(tasks, "MOA_AOA_DRAFTING", "Draft MOA & AOA", "MEDIUM");
        addTask(tasks, "SPICE_SUBMISSION", "File SPICe+ Part B", "HIGH");
        addTask(tasks, "COI_GENERATION", "Generate Certificate of Incorporation", "HIGH");
        addTask(tasks, "PAN_TAN_ALLOCATION", "Ensure PAN & TAN Dispatch", "MEDIUM");

        // Standard
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "NOMINEE_CONSENT", "File Nominee Consent (INC-3)", "MEDIUM");
            addTask(tasks, "SHARE_CERTIFICATES", "Issue Share Certificates", "MEDIUM");
        }

        // Premium
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_REGISTRATION", "File GST Registration", "HIGH");
            addTask(tasks, "MSME_REGISTRATION", "File Udyam Registration", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_OPENING", "Initiate Bank Account Opening", "MEDIUM");
            addTask(tasks, "BOARD_RESOLUTION", "Draft First Board Resolution", "LOW");
            addTask(tasks, "COMPLIANCE_SETUP", "Setup Annual Compliance Calendar", "LOW");
        }

        return tasks;
    }

    private void addTask(List<OnePersonCompanyRegistrationRequest.AutomationTaskDTO> tasks, String task, String desc,
            String priority) {
        OnePersonCompanyRegistrationRequest.AutomationTaskDTO t = new OnePersonCompanyRegistrationRequest.AutomationTaskDTO();
        t.setTask(task);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }
}
