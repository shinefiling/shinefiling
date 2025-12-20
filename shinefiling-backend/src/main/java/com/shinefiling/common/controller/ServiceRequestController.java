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
    private com.shinefiling.licenses.service.TradeLicenseService tradeLicenseService;

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
                if (sName.contains("private limited")) {
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

            // 3. Map FSSAI Applications - REMOVED (Fetched via /api/fssai/my-requests)

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
        // Fetch all applications
        List<ServiceRequest> standardRequests = serviceRequestService.getAllRequests();
        List<PrivateLimitedApplication> pvtUsers = pvtLtdService.getAllApplications();
        List<FssaiApplication> fssaiApps = fssaiService.getAllApplications();
        List<com.shinefiling.licenses.model.TradeLicenseApplication> tradeApps = tradeLicenseService
                .getAllApplications();

        List<Map<String, Object>> result = new ArrayList<>();

        // Create a set of Service Request IDs that have specialized records
        java.util.Set<Long> specializedServiceRequestIds = new java.util.HashSet<>();
        for (PrivateLimitedApplication p : pvtUsers) {
            if (p.getServiceRequestId() != null) {
                specializedServiceRequestIds.add(p.getServiceRequestId());
            }
        }

        // 1. Standard
        for (ServiceRequest r : standardRequests) {
            String sName = r.getServiceName().toLowerCase();

            // Filter out if this generic request has a specialized counterpart
            if (specializedServiceRequestIds.contains(r.getId())) {
                continue;
            }

            if (sName.contains("fssai") || sName.contains("trade license")
                    || sName.contains("partnership firm") || sName.contains("agreement") || sName.contains("nda")) {
                continue;
            }

            // Deduplicate Private Limited if explicitly named but somehow not linked
            // (Double Safety)
            // But if it wasn't in specializedServiceRequestIds, maybe it's an orphan, so we
            // keep it.
            // However, the user complained about duplicates, so let's be strict if the name
            // matches exactly.
            // STRICT DEDUPLICATION:
            // "Private Limited Company" is a specialized service. It should ALWAYS appear
            // in the specialized list.
            // If we see a Generic ServiceRequest for it, it matches the specialized one
            // (duplicate) or is an orphan.
            // In either case, we do NOT want to show it as a "Service Request" in the
            // combined list,
            // because the specialized view provides better data.
            if (sName.contains("private limited")) {
                continue;
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("serviceName", r.getServiceName());
            map.put("status", r.getStatus());
            map.put("createdAt", r.getCreatedAt());
            map.put("user", r.getUser());
            map.put("submissionId", r.getId().toString());

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

            // CRITICAL: Pass formData
            map.put("formData", r.getFormData());

            result.add(map);
        }

        // 2. Private Limited
        for (PrivateLimitedApplication r : pvtUsers) {
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

            map.put("businessName",
                    (r.getProposedNames() != null && !r.getProposedNames().isEmpty()) ? r.getProposedNames().get(0)
                            : "N/A");
            map.put("businessType", "Private Limited Company");
            map.put("applicantName", r.getUser() != null ? r.getUser().getFullName() : "N/A");
            map.put("amountPaid", r.getAmountPaid());
            map.put("uploadedDocuments", r.getUploadedDocuments());

            map.put("uploadedDocuments", r.getUploadedDocuments());

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

        // 3. FSSAI - REMOVED (Fetched via /api/fssai/all)

        // 4. Map Trade License Applications
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

        // Sort Descending
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
