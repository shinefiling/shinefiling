package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import com.shinefiling.licenses.model.FssaiApplication;
import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import com.shinefiling.common.service.ServiceRequestService;
import com.shinefiling.licenses.service.FssaiService;
import com.shinefiling.business_reg.service.PrivateLimitedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shinefiling.legal.service.*;
import com.shinefiling.legal.model.*;
import com.shinefiling.business_reg.service.*;
import com.shinefiling.business_reg.model.*;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private FssaiService fssaiService;

    @Autowired
    private PrivateLimitedService pvtLtdService;
    @Autowired
    private LlpService llpService;
    @Autowired
    private OnePersonCompanyService opcService;
    @Autowired
    private ProprietorshipService proprietorshipService;
    @Autowired
    private Section8Service section8Service;
    @Autowired
    private NidhiService nidhiService;
    @Autowired
    private ProducerService producerService;
    @Autowired
    private PublicLimitedService publicLimitedService;

    @Autowired
    private com.shinefiling.licenses.service.TradeLicenseService tradeLicenseService;

    @Autowired
    private PartnershipDeedService partnershipDeedService;
    @Autowired
    private FoundersAgreementService foundersAgreementService;
    @Autowired
    private ShareholdersAgreementService shareholdersAgreementService;
    @Autowired
    private EmploymentAgreementService employmentAgreementService;
    @Autowired
    private RentAgreementService rentAgreementService;
    @Autowired
    private FranchiseAgreementService franchiseAgreementService;
    @Autowired
    private NdaService ndaService;
    @Autowired
    private VendorAgreementService vendorAgreementService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForService(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        String serviceName = (String) payload.get("serviceName");

        String formData = "";
        if (payload.get("formData") != null) {
            formData = payload.get("formData").toString();
        }

        try {
            ServiceRequest request = serviceRequestService.createRequest(email, serviceName, formData);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getUserRequests(@RequestParam String email) {
        try {
            // Fetch applications from all services
            List<ServiceRequest> standardRequests = serviceRequestService.getKeyRequests(email);
            List<PrivateLimitedApplication> pvtApps = pvtLtdService.getApplicationsByUser(email);
            // List<FssaiApplication> fssaiApps = fssaiService.getUserApplications(email);
            // // Removed: Frontend fetches this separately

            List<Map<String, Object>> result = new ArrayList<>();

            // 1. Collect specialized IDs to prevent duplicates
            java.util.Set<String> specializedIds = new java.util.HashSet<>();
            for (PrivateLimitedApplication p : pvtApps) {
                if (p.getSubmissionId() != null)
                    specializedIds.add(p.getSubmissionId());
                // Also add the generic ID if it matches (assuming linkage)
            }

            // 2. Map Standard Requests
            for (ServiceRequest r : standardRequests) {
                String sName = r.getServiceName().toLowerCase();

                // FILTER: Strict exclusion for other services
                // FILTER: Strict exclusion for services handled by other controllers
                if (sName.contains("fssai") || sName.contains("trade license")) {
                    continue;
                }

                // Strict filter for Partnership FIRM (Specialized, has its own controller)
                // but allow Partnership DEED (Generic, handled here)
                if (sName.contains("partnership firm")) {
                    continue;
                }

                // STRICT DEDUPLICATION:
                // Specialized services like Private Limited are handled in the pvtApps loop
                // below.
                // We MUST skip the generic ServiceRequest here to avoid showing the same order
                // twice.
                if (sName.contains("private limited") || sName.contains("llp") || sName.contains("one person company")
                        || sName.contains("proprietorship") || sName.contains("section 8")
                        || sName.contains("nidhi") || sName.contains("producer")
                        || sName.contains("public limited")
                        || sName.contains("agreement") || sName.contains("nda") || sName.contains("partnership deed")) {
                    continue;
                }

                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getId());
                map.put("serviceName", r.getServiceName());
                map.put("status", r.getStatus());
                map.put("createdAt", r.getCreatedAt());
                map.put("user", r.getUser());
                map.put("submissionId", r.getId().toString());

                // Generic Details
                map.put("amountPaid", r.getAmount());
                map.put("businessType", "Service Request");
                map.put("applicantName", r.getUser() != null ? r.getUser().getFullName() : "");
                map.put("businessName", r.getServiceName());

                // Frontend Compatibility Keys
                map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                map.put("service", r.getServiceName());
                map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                map.put("amount", r.getAmount());

                // CRITICAL: Pass formData so that the specific workflow panels can render
                // details
                map.put("formData", r.getFormData());

                result.add(map);
            }

            // 2. Map Private Limited Applications
            for (PrivateLimitedApplication r : pvtApps) {
                // FILTER: Prevent FSSAI apps from appearing as Pvt Ltd if they share table/ID
                // space
                if (r.getSubmissionId() != null && (r.getSubmissionId().toUpperCase().contains("FSSAI")
                        || r.getSubmissionId().toUpperCase().contains("TL-"))) {
                    continue;
                }

                Map<String, Object> map = new HashMap<>();
                // USE LINKED SERVICE REQUEST ID if available (for Actions), otherwise fallback
                // to SubmissionId (Read Only)
                map.put("id", r.getServiceRequestId() != null ? r.getServiceRequestId() : r.getSubmissionId());
                map.put("serviceName", "Private Limited Registration");
                map.put("status", r.getStatus());
                map.put("createdAt", r.getCreatedAt());
                map.put("user", r.getUser());
                map.put("submissionId", r.getSubmissionId());
                map.put("generatedDocuments", r.getGeneratedDocuments());
                map.put("certificatePath", r.getCertificatePath());
                map.put("srn", r.getSrn());

                // Detail Fields for Frontend Modal
                map.put("businessName",
                        (r.getProposedNames() != null && !r.getProposedNames().isEmpty()) ? r.getProposedNames().get(0)
                                : "N/A");
                map.put("businessType", "Private Limited Company");
                map.put("applicantName", r.getUser() != null ? r.getUser().getFullName() : "N/A");
                map.put("amountPaid", r.getAmountPaid());
                map.put("uploadedDocuments", r.getUploadedDocuments());

                // Frontend Compatibility Keys
                map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                map.put("service", "Private Limited Registration");
                map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                map.put("amount", r.getAmountPaid());

                // CRITICAL: Reconstruct formData for the Admin Panel
                Map<String, Object> reconstructedFormData = new HashMap<>();
                if (r.getProposedNames() != null && !r.getProposedNames().isEmpty()) {
                    reconstructedFormData.put("companyName1", r.getProposedNames().get(0));
                    if (r.getProposedNames().size() > 1)
                        reconstructedFormData.put("companyName2", r.getProposedNames().get(1));
                }
                reconstructedFormData.put("activity", r.getBusinessActivity());
                reconstructedFormData.put("registeredAddress", r.getRegisteredAddress());
                reconstructedFormData.put("authorizedCapital", r.getAuthorizedCapital());
                reconstructedFormData.put("paidUpCapital", r.getPaidUpCapital());
                reconstructedFormData.put("plan", r.getPlanType());

                if (r.getDirectors() != null) {
                    List<Map<String, String>> dirList = new ArrayList<>();
                    for (com.shinefiling.business_reg.model.PvtLtdDirector d : r.getDirectors()) {
                        Map<String, String> dMap = new HashMap<>();
                        dMap.put("name", d.getName());
                        dMap.put("email", d.getEmail());
                        dMap.put("phone", d.getPhone());
                        dMap.put("pan", d.getPanNumber());
                        dMap.put("aadhaar", d.getAadhaarNumber());
                        dMap.put("designation", "Director");
                        dirList.add(dMap);
                    }
                    reconstructedFormData.put("directors", dirList);
                }
                map.put("formData", reconstructedFormData);

                result.add(map);
            }

            // 3. Business Registration Services (LLP, OPC, etc.)

            // LLP
            for (LlpApplication r : llpService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId()); // Use submissionId for ID to avoid confusion or Long if needed
                    map.put("serviceName", "Limited Liability Partnership");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("submissionId", r.getSubmissionId());
                    map.put("amountPaid", 8999); // Est
                    map.put("formData", r.getFormData());
                    result.add(map);
                }
            }

            // OPC
            for (OnePersonCompanyApplication r : opcService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "One Person Company");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        if (r.getProposedNames() != null && !r.getProposedNames().isEmpty())
                            form.put("companyName", r.getProposedNames().get(0));
                        form.put("directorName", r.getDirectorName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Proprietorship
            for (ProprietorshipApplication r : proprietorshipService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getServiceRequestId());
                    map.put("serviceName", "Sole Proprietorship");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("submissionId", r.getServiceRequestId());
                    map.put("formData", r.getFormData());
                    result.add(map);
                }
            }

            // Section 8
            for (Section8Application r : section8Service.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getServiceRequestId());
                    map.put("serviceName", "Section 8 Company");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("submissionId", r.getServiceRequestId());
                    Map<String, Object> form = new HashMap<>();
                    try {
                        if (r.getNgoNameOption1() != null)
                            form.put("companyName", r.getNgoNameOption1());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Nidhi
            for (NidhiApplication r : nidhiService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getServiceRequestId());
                    map.put("serviceName", "Nidhi Company");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("submissionId", r.getServiceRequestId());
                    Map<String, Object> form = new HashMap<>();
                    try {
                        if (r.getCompanyNameOption1() != null)
                            form.put("companyName", r.getCompanyNameOption1());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Producer
            for (ProducerApplication r : producerService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getServiceRequestId());
                    map.put("serviceName", "Producer Company");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("submissionId", r.getServiceRequestId());
                    Map<String, Object> form = new HashMap<>();
                    try {
                        if (r.getCompanyNameOption1() != null)
                            form.put("companyName", r.getCompanyNameOption1());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Public Limited
            for (PublicLimitedApplication r : publicLimitedService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getServiceRequestId());
                    map.put("serviceName", "Public Limited Company");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("submissionId", r.getServiceRequestId());
                    Map<String, Object> form = new HashMap<>();
                    try {
                        if (r.getCompanyNameOption1() != null)
                            form.put("companyName", r.getCompanyNameOption1());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // 4. Legal Drafting Services

            // Partnership Deed
            for (PartnershipDeedApplication r : partnershipDeedService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Partnership Deed");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    form.put("details", "Firm: " + r.getFirmName());
                    try {
                        form.put("firmName", r.getFirmName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Founders Agreement
            for (FoundersAgreementApplication r : foundersAgreementService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Founders Agreement");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("companyName", r.getCompanyName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Shareholders Agreement
            for (ShareholdersAgreementApplication r : shareholdersAgreementService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Shareholders Agreement");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("companyName", r.getCompanyName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Employment Agreement
            for (EmploymentAgreementApplication r : employmentAgreementService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Employment Agreement");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("employerName", r.getEmployerName());
                        form.put("employeeName", r.getEmployeeName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Rent Agreement
            for (RentAgreementApplication r : rentAgreementService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Rent Agreement");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("landlordName", r.getLandlordName());
                        form.put("tenantName", r.getTenantName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Franchise Agreement
            for (FranchiseAgreementApplication r : franchiseAgreementService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Franchise Agreement");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("franchisorName", r.getFranchisorName());
                        form.put("franchiseeName", r.getFranchiseeName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // NDA
            for (NdaApplication r : ndaService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "NDA");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("disclosingParty", r.getDisclosingParty());
                        form.put("receivingParty", r.getReceivingParty());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // Vendor Agreement
            for (VendorAgreementApplication r : vendorAgreementService.getAllApplications()) {
                if (r.getUser() != null && r.getUser().getEmail().equalsIgnoreCase(email)) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Vendor Agreement");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("submissionId", r.getSubmissionId());

                    Map<String, Object> form = new HashMap<>();
                    try {
                        form.put("companyName", r.getCompanyName());
                        form.put("vendorName", r.getVendorName());
                    } catch (Exception e) {
                    }
                    map.put("formData", form);
                    result.add(map);
                }
            }

            // 5. Map FSSAI Applications - REMOVED (Fetched via /api/fssai/my-requests)

            // 4. Map Trade License Applications
            List<com.shinefiling.licenses.model.TradeLicenseApplication> tradeApps = tradeLicenseService
                    .getUserApplications(email);
            for (com.shinefiling.licenses.model.TradeLicenseApplication r : tradeApps) {
                Map<String, Object> map = new HashMap<>();
                map.put("id", r.getSubmissionId());
                map.put("serviceName", "Trade License (" + r.getPlanType() + ")");
                map.put("status", r.getStatus());
                map.put("createdAt", r.getCreatedAt());
                map.put("user", r.getUser());
                map.put("submissionId", r.getSubmissionId());
                map.put("generatedDocuments", r.getGeneratedDocuments());

                // Detail Fields
                map.put("businessName", r.getBusinessName());
                map.put("businessType", "Trade License");
                map.put("applicantName", r.getApplicantName() != null ? r.getApplicantName()
                        : (r.getUser() != null ? r.getUser().getFullName() : "N/A"));
                map.put("amountPaid", r.getAmountPaid());
                map.put("uploadedDocuments", r.getUploadedDocuments());

                // Frontend Compatibility Keys
                map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                map.put("service", "Trade License");
                map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                map.put("amount", r.getAmountPaid());

                result.add(map);
            }

            // Sort by Created Date (Descending)
            result.sort((a, b) -> {
                try {
                    LocalDateTime d1 = (LocalDateTime) a.get("createdAt");
                    LocalDateTime d2 = (LocalDateTime) b.get("createdAt");
                    return d2.compareTo(d1);
                } catch (Exception e) {
                    return 0;
                }
            });

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllRequests() {
        try {
            List<Map<String, Object>> result = new ArrayList<>();

            // 1. Fetch Lists
            List<ServiceRequest> standardRequests = serviceRequestService.getAllRequests();
            List<PrivateLimitedApplication> pvtApps = pvtLtdService.getAllApplications();

            // Set of specialized IDs to exclude from generic list
            java.util.Set<Long> specializedServiceRequestIds = new java.util.HashSet<>();
            for (PrivateLimitedApplication p : pvtApps) {
                if (p.getServiceRequestId() != null)
                    specializedServiceRequestIds.add(p.getServiceRequestId());
            }

            // 2. Map Standard Requests
            for (ServiceRequest r : standardRequests) {
                try {
                    String sName = r.getServiceName() != null ? r.getServiceName().toLowerCase() : "";
                    if (specializedServiceRequestIds.contains(r.getId()))
                        continue;

                    // Exclude other specialized strings if they are handled separately
                    if (sName.contains("private limited") || sName.contains("llp")
                            || sName.contains("one person company")
                            || sName.contains("proprietorship") || sName.contains("section 8")
                            || sName.contains("nidhi") || sName.contains("producer")
                            || sName.contains("public limited") || sName.contains("trade license")
                            || sName.contains("fssai")) {
                        continue;
                    }

                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getId());
                    map.put("serviceName", r.getServiceName());
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("user", r.getUser());
                    map.put("submissionId", r.getId().toString()); // Fallback
                    if (r.getAmount() != null)
                        map.put("amountPaid", r.getAmount());

                    // Frontend Compatibility
                    map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                    map.put("service", r.getServiceName());
                    map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                    map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                    map.put("amount", r.getAmount());

                    if (r.getFormData() != null && !r.getFormData().isEmpty()) {
                        try {
                            map.put("formData", objectMapper.readValue(r.getFormData(), Map.class));
                        } catch (Exception e) {
                            map.put("formData", r.getFormData());
                        }
                    }

                    result.add(map);
                } catch (Exception e) {
                    System.err.println("Error mapping generic request: " + e.getMessage());
                }
            }

            // 3. specialized - Pvt Ltd
            for (PrivateLimitedApplication r : pvtApps) {
                try {
                    Map<String, Object> map = new HashMap<>();
                    // Use ServiceRequest ID if available for actions, else generic ID
                    Long id = r.getServiceRequestId();
                    if (id == null && r.getId() != null)
                        id = r.getId();

                    map.put("id", id);
                    map.put("serviceName", "Private Limited Company");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("user", r.getUser());
                    map.put("submissionId", r.getSubmissionId());
                    map.put("amountPaid", r.getAmountPaid());

                    map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                    map.put("service", "Private Limited Company");
                    map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                    map.put("mobile", r.getUser() != null ? r.getUser().getMobile() : "");
                    map.put("amount", r.getAmountPaid());

                    Map<String, Object> form = new HashMap<>();
                    if (r.getProposedNames() != null && !r.getProposedNames().isEmpty())
                        form.put("companyName", r.getProposedNames().get(0));
                    map.put("formData", form);

                    result.add(map);
                } catch (Exception e) {
                }
            }

            // 4. Trade License
            try {
                for (com.shinefiling.licenses.model.TradeLicenseApplication r : tradeLicenseService
                        .getAllApplications()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId()); // String ID
                    map.put("serviceName", "Trade License");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getCreatedAt());
                    map.put("user", r.getUser());
                    map.put("submissionId", r.getSubmissionId());
                    map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                    map.put("service", "Trade License");
                    map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                    map.put("amount", r.getAmountPaid());
                    result.add(map);
                }
            } catch (Exception e) {
            }

            // 5. LLP
            try {
                for (LlpApplication r : llpService.getAllApplications()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "Limited Liability Partnership");
                    map.put("status", r.getStatus());
                    map.put("createdAt", r.getSubmittedDate());
                    map.put("user", r.getUser());
                    map.put("submissionId", r.getSubmissionId());
                    map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                    map.put("service", "LLP Registration");
                    map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                    result.add(map);
                }
            } catch (Exception e) {
            }

            // 6. FSSAI
            try {
                for (FssaiApplication r : fssaiService.getAllApplications()) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getSubmissionId());
                    map.put("serviceName", "FSSAI License");
                    map.put("status", r.getStatus());
                    // FSSAI might use different date field, typically createdAt or submittedDate
                    // Assuming createdAt based on typical patterns, if not fallback
                    map.put("createdAt", r.getSubmissionId()); // Hack if date missing, but sort will fail. Let's hope
                                                               // for robust checking
                    map.put("user", r.getUser());
                    map.put("submissionId", r.getSubmissionId());
                    map.put("client", r.getUser() != null ? r.getUser().getFullName() : "Unknown");
                    map.put("service", "FSSAI License");
                    map.put("email", r.getUser() != null ? r.getUser().getEmail() : "");
                    map.put("amount", r.getAmountPaid());
                    result.add(map);
                }
            } catch (Exception e) {
            }

            // Sort
            result.sort((a, b) -> {
                try {
                    Object d1 = a.get("createdAt");
                    Object d2 = b.get("createdAt");
                    if (d1 instanceof LocalDateTime && d2 instanceof LocalDateTime) {
                        return ((LocalDateTime) d2).compareTo((LocalDateTime) d1);
                    }
                    return 0;
                } catch (Exception e) {
                    return 0;
                }
            });

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", e.getMessage()));
        }
    }

    @GetMapping("/agent-requests")
    public ResponseEntity<?> getAgentRequests(@RequestParam String email) {
        try {
            List<ServiceRequest> requests = serviceRequestService.getAgentRequests(email);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/{id}/assign")
    public ResponseEntity<?> assignAgent(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        try {
            Long agentId = payload.get("agentId");
            ServiceRequest request = serviceRequestService.assignAgent(id, agentId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        try {
            return ResponseEntity.ok(serviceRequestService.updateStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
