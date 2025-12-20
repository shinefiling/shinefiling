package com.shinefiling.business_reg.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shinefiling.business_reg.dto.PrivateLimitedRegistrationRequest;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/service/private-limited-company")
@CrossOrigin(origins = "http://localhost:5173")
public class PrivateLimitedCompanyController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private com.shinefiling.business_reg.service.PrivateLimitedService pvtLtdService;

    @Autowired
    private com.shinefiling.common.service.NotificationService notificationService;

    private static final String SERVICE_NAME = "Private Limited Company";

    @PostMapping("/apply")
    public ResponseEntity<?> apply(@RequestBody PrivateLimitedRegistrationRequest requestDTO) {
        try {
            // 1. Extract Details
            String email = requestDTO.getUserEmail();
            String plan = requestDTO.getPlan();
            if (plan == null)
                plan = "basic";

            // 2. Generate Plan-Based Automation Tasks
            List<PrivateLimitedRegistrationRequest.AutomationTaskDTO> tasks = generateAutomationTasks(plan);
            requestDTO.setAutomationQueue(tasks);

            // 3. Set Status if not already
            if (requestDTO.getStatus() == null) {
                requestDTO.setStatus("PAYMENT_SUCCESSFUL");
            }

            // 4. Serialize to JSON for Storage in 'formData'
            // This JSON now contains the 'automationQueue' which includes the checklist for
            // admins
            String formDataStr = new ObjectMapper().writeValueAsString(requestDTO);

            // 5. Create Service Request (This saves the initial entity)
            ServiceRequest createdRequest = serviceRequestService.createRequest(email, SERVICE_NAME, formDataStr);

            // 6. Update Plan & Specific Columns (Enhancement for Admin Dashboard Filtering)
            createdRequest.setPlan(plan.toUpperCase());

            // Map plan to amount if not provided
            if (requestDTO.getAmountPaid() != null) {
                createdRequest.setAmount(requestDTO.getAmountPaid());
            } else {
                createdRequest.setAmount(getPlanAmount(plan));
            }

            createdRequest.setPaymentStatus("PAID");
            createdRequest.setPaymentStatus("PAID");
            createdRequest.setStatus("PAYMENT_SUCCESSFUL");

            // NOTIFICATIONS
            try {
                // 1. Notify Admins
                notificationService.notifyAdmins("ORDER", "New Private Limited Registration",
                        "New application from " + email, createdRequest.getId().toString());

                // 2. Notify Client
                if (createdRequest.getUser() != null) {
                    notificationService.createNotification(
                            createdRequest.getUser(),
                            "ORDER_UPDATE",
                            "Application Received",
                            "Your Private Limited Company registration has been received. Reference ID: "
                                    + createdRequest.getId(),
                            createdRequest.getId().toString(),
                            "SERVICE_REQUEST");
                }
            } catch (Exception e) {
                System.err.println("Failed to send notifications: " + e.getMessage());
            }

            // Save the updates
            serviceRequestRepository.save(createdRequest);

            // 7. Create Specialized Entity for Admin Workflow
            try {
                com.shinefiling.business_reg.model.PrivateLimitedApplication pvtApp = new com.shinefiling.business_reg.model.PrivateLimitedApplication();
                pvtApp.setServiceRequestId(createdRequest.getId());
                pvtApp.setSubmissionId(requestDTO.getSubmissionId());
                pvtApp.setPlanType(plan);
                pvtApp.setStatus("PAYMENT_SUCCESSFUL");
                pvtApp.setAmountPaid(createdRequest.getAmount());

                if (requestDTO.getFormData() != null) {
                    PrivateLimitedRegistrationRequest.PvtLtdFormData formData = requestDTO.getFormData();
                    pvtApp.setProposedNames(formData.getCompanyNames());
                    pvtApp.setBusinessActivity(formData.getBusinessActivity());
                    pvtApp.setRegisteredAddress(formData.getAddressLine1() + ", " + formData.getDistrict() + ", "
                            + formData.getState() + " - " + formData.getPincode());
                    pvtApp.setAuthorizedCapital(formData.getAuthorizedCapital());
                    pvtApp.setPaidUpCapital(formData.getPaidUpCapital());

                    if (formData.getDirectors() != null) {
                        List<com.shinefiling.business_reg.model.PvtLtdDirector> dirList = new ArrayList<>();
                        for (PrivateLimitedRegistrationRequest.DirectorDTO dDto : formData.getDirectors()) {
                            com.shinefiling.business_reg.model.PvtLtdDirector d = new com.shinefiling.business_reg.model.PvtLtdDirector();
                            d.setName(dDto.getName());
                            d.setFatherName(dDto.getFatherName());
                            d.setDob(dDto.getDob());
                            d.setPanNumber(dDto.getPan());
                            d.setAadhaarNumber(dDto.getAadhaar());
                            d.setEmail(dDto.getEmail());
                            d.setPhone(dDto.getPhone());
                            d.setDirectorType(dDto.getDirectorType());
                            d.setDinNumber(dDto.getDinNumber());
                            d.setPhotoUrl(dDto.getPhotoUrl());
                            d.setPanUrl(dDto.getPanUrl());
                            d.setAadhaarUrl(dDto.getAadhaarUrl());
                            d.setAddressProofUrl(dDto.getAddressProofUrl());
                            d.setSignatureUrl(dDto.getSignatureUrl());
                            d.setApplication(pvtApp);
                            dirList.add(d);
                        }
                        pvtApp.setDirectors(dirList);
                    }
                }

                if (requestDTO.getDocuments() != null) {
                    java.util.Map<String, String> docMap = new java.util.HashMap<>();
                    for (PrivateLimitedRegistrationRequest.UploadedDocumentDTO doc : requestDTO.getDocuments()) {
                        docMap.put(doc.getId(), doc.getFileUrl());
                    }
                    pvtApp.setUploadedDocuments(docMap);
                }

                pvtLtdService.createApplication(pvtApp, email);

            } catch (Exception ex) {
                System.err.println("Error creating specialized Pvt Ltd entity: " + ex.getMessage());
                ex.printStackTrace();
            }

            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(@RequestParam String email) {
        try {
            List<ServiceRequest> requests = serviceRequestService.getUserRequestsByService(email, SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<ServiceRequest> requests = serviceRequestService.getRequestsByService(SERVICE_NAME);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        try {
            com.shinefiling.common.model.ServiceRequest updatedReq = serviceRequestService.updateStatus(id, status);

            // NOTIFY CLIENT OF STATUS CHANGE
            if (updatedReq != null && updatedReq.getUser() != null) {
                try {
                    notificationService.createNotification(
                            updatedReq.getUser(),
                            "ORDER_UPDATE",
                            "Status Updated: " + status,
                            "Your application status has been updated to " + status,
                            updatedReq.getId().toString(),
                            "SERVICE_REQUEST");
                } catch (Exception e) {
                    System.err.println("Failed to send status update notification: " + e.getMessage());
                }
            }
            return ResponseEntity.ok(updatedReq);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // --- HELPER METHODS ---

    private List<PrivateLimitedRegistrationRequest.AutomationTaskDTO> generateAutomationTasks(String plan) {
        List<PrivateLimitedRegistrationRequest.AutomationTaskDTO> tasks = new ArrayList<>();

        // Common Tasks (All Plans)
        addTask(tasks, "DOCUMENT_VERIFICATION", "Verify KYC & Office Proofs", "HIGH");
        addTask(tasks, "DSC_DIN_APPLICATION", "Apply for Digital Signatures & DIN", "HIGH");
        addTask(tasks, "NAME_APPROVAL", "File RUN Service for Name Approval", "MEDIUM");
        addTask(tasks, "MOA_AOA_DRAFTING", "Draft MOA & AOA with Clauses", "MEDIUM");
        addTask(tasks, "SPICE_SUBMISSION", "File SPICe+ Part B", "HIGH");
        addTask(tasks, "COI_GENERATION", "Generate Certificate of Incorporation", "HIGH");

        // Standard & Premium
        if (!"basic".equalsIgnoreCase(plan)) {
            addTask(tasks, "SHARE_CERTIFICATES", "Issue Share Certificates", "MEDIUM");
            addTask(tasks, "PAN_TAN_ALLOCATION", "Ensure PAN & TAN Dispatch", "MEDIUM");
        }

        // Premium Only
        if ("premium".equalsIgnoreCase(plan)) {
            addTask(tasks, "GST_REGISTRATION", "File for GST Registration", "HIGH");
            addTask(tasks, "MSME_REGISTRATION", "File Udyam Registration", "MEDIUM");
            addTask(tasks, "BANK_ACCOUNT_OPENING", "Initiate Bank Account Opening", "MEDIUM");
            addTask(tasks, "FIRST_BOARD_RESOLUTION", "Draft First Board Resolution", "LOW");
        }

        return tasks;
    }

    private void addTask(List<PrivateLimitedRegistrationRequest.AutomationTaskDTO> tasks, String taskName, String desc,
            String priority) {
        PrivateLimitedRegistrationRequest.AutomationTaskDTO t = new PrivateLimitedRegistrationRequest.AutomationTaskDTO();
        t.setTask(taskName);
        t.setDescription(desc);
        t.setPriority(priority);
        tasks.add(t);
    }

    private Double getPlanAmount(String plan) {
        switch (plan.toLowerCase()) {
            case "basic":
                return 4999.0;
            case "standard":
                return 8999.0;
            case "premium":
                return 12999.0;
            default:
                return 0.0;
        }
    }
}
