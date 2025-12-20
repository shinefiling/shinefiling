package com.shinefiling.common.controller;

import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.common.model.User;
import com.shinefiling.common.model.Payment;
import com.shinefiling.common.repository.ServiceRequestRepository;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.repository.PaymentRepository;
import com.shinefiling.common.repository.StoredFileRepository;
import com.shinefiling.common.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

        @Autowired
        private ServiceRequestRepository serviceRequestRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private PaymentRepository paymentRepository;

        @Autowired
        private com.shinefiling.common.repository.ServiceProductRepository serviceProductRepository;

        @Autowired
        private com.shinefiling.business_reg.service.PrivateLimitedService pvtLtdService;

        @jakarta.annotation.PostConstruct
        public void initServiceCatalog() {
                if (serviceProductRepository.count() == 0) {
                        List<com.shinefiling.common.model.ServiceProduct> catalog = new ArrayList<>();
                        // Seeding Data
                        addServices(catalog, "business_reg", "Business Registration", "#6366f1", Arrays.asList(
                                        "Private Limited Company Registration", "One Person Company (OPC)",
                                        "Limited Liability Partnership (LLP)", "Partnership Firm Registration",
                                        "Sole Proprietorship Registration", "Section 8 NGO Company",
                                        "Nidhi Company Registration", "Producer Company Registration",
                                        "Public Limited Company"));

                        addServices(catalog, "tax_compliance", "Tax & Compliance", "#10b981", Arrays.asList(
                                        "GST Registration", "GST Monthly Return (GSTR-1 & 3B)",
                                        "GST Annual Return (GSTR-9)",
                                        "Income Tax Return (ITR 1–7)", "TDS Return Filing",
                                        "Professional Tax Reg & Filing",
                                        "Advance Tax Filing", "Tax Audit Filing"));

                        addServices(catalog, "roc_compliance", "ROC / MCA Filings", "#3b82f6", Arrays.asList(
                                        "Annual ROC Filing (AOC-4, MGT-7)", "Director KYC (DIR-3 KYC)",
                                        "Add/Remove Director",
                                        "Change of Registered Office", "Share Transfer Filing",
                                        "Increase Authorized Capital",
                                        "MOA/AOA Amendment", "Company Name Change", "Strike Off Company"));

                        addServices(catalog, "licenses", "Government Licenses", "#f97316", Arrays.asList(
                                        "FSSAI License (Basic/State/Central)", "Shop & Establishment License",
                                        "Trade License",
                                        "Labour License", "Factory License", "Drug License", "Fire Safety NOC",
                                        "Pollution Control (CTE/CTO)", "Import Export Code (IEC)", "Gumastha License",
                                        "Bar / Liquor License"));

                        addServices(catalog, "ipr", "Intellectual Property", "#8b5cf6", Arrays.asList(
                                        "Trademark Registration", "Trademark Objection Reply",
                                        "Trademark Hearing Support",
                                        "Trademark Assignment", "Trademark Renewal", "Copyright Registration",
                                        "Patent Filing (Provisional/Complete)", "Design Registration"));

                        addServices(catalog, "labour_hr", "Labour Law & HR", "#06b6d4", Arrays.asList(
                                        "PF Registration & Filing", "ESI Registration & Filing",
                                        "Professional Tax Reg & Filing",
                                        "Labour Welfare Fund Filing", "Gratuity Act Registration",
                                        "Bonus Act Compliance",
                                        "Minimum Wages Compliance"));

                        addServices(catalog, "certifications", "Business Certifications", "#f59e0b", Arrays.asList(
                                        "MSME / Udyam Registration", "ISO Certification (9001, 14001)",
                                        "Startup India Recognition",
                                        "Digital Signature (DSC)", "Bar Code Registration", "TAN / PAN Application"));

                        addServices(catalog, "legal", "Legal Drafting", "#f43f5e", Arrays.asList(
                                        "Partnership Deed", "Founders Agreement", "Shareholders Agreement",
                                        "Employment Agreement",
                                        "Rent Agreement", "Franchise Agreement", "NDA (Non-Disclosure)",
                                        "Vendor Agreement"));

                        addServices(catalog, "financial", "Financial Services", "#14b8a6", Arrays.asList(
                                        "CMA Data Preparation", "Project Report for Loans", "Bank Loan Documentation",
                                        "Cash Flow Compliance", "Startup Pitch Deck", "Business Valuation Reports"));

                        addServices(catalog, "storage", "Mini DigiLocker", "#eab308", Arrays.asList(
                                        "Store PAN Card", "Store Aadhaar Card", "Store Rent Agreement",
                                        "Store GST Cert",
                                        "Store FSSAI Cert", "Business Doc Vault", "Secure PDF Download"));

                        serviceProductRepository.saveAll(catalog);
                        System.out.println("Initialized Service Catalog with " + catalog.size() + " items.");
                }
        }

        @GetMapping("/stats")
        public Map<String, Object> getAdminStats() {
                List<ServiceRequest> allRequests = serviceRequestRepository.findAll();
                List<com.shinefiling.business_reg.model.PrivateLimitedApplication> allPvtLtdApps = pvtLtdService
                                .getAllApplications();
                List<User> allUsers = userRepository.findAll();
                List<Payment> allPayments = paymentRepository.findAll();

                double totalRevenue = allPayments.stream()
                                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                                .mapToDouble(Payment::getAmount)
                                .sum();

                // Add Pvt Ltd Revenue (approx based on amountPaid field if not in Payment
                // table)
                // Assuming Payment table handles the transaction, if not we add from apps:
                // totalRevenue += allPvtLtdApps.stream().mapToDouble(a -> a.getAmountPaid() !=
                // null ? a.getAmountPaid() : 0.0).sum();

                long pendingActions = allRequests.stream()
                                .filter(r -> "PENDING".equalsIgnoreCase(r.getStatus()))
                                .count();

                long pendingPvtLtd = allPvtLtdApps.stream()
                                .filter(r -> "SUBMITTED".equalsIgnoreCase(r.getStatus())
                                                || "DOCUMENTS_VERIFIED".equalsIgnoreCase(r.getStatus()))
                                .count();

                long totalPending = pendingActions + pendingPvtLtd;

                long activeUsers = allUsers.stream()
                                .filter(u -> "USER".equals(u.getRole()))
                                .count();

                // KPI Cards
                List<Map<String, String>> kpi = new ArrayList<>();
                kpi.add(Map.of("label", "Total Revenue", "value", "₹" + (long) totalRevenue, "sub", "Total Earnings",
                                "type",
                                "revenue"));
                kpi.add(Map.of("label", "Pending Actions", "value", String.valueOf(totalPending), "sub",
                                "Requires Attention",
                                "type", "pending"));
                kpi.add(Map.of("label", "Total Users", "value", String.valueOf(activeUsers), "sub",
                                "Registered Clients",
                                "type", "clients"));
                kpi.add(Map.of("label", "System Status", "value", "Healthy", "sub", "All Services Up", "type",
                                "alerts"));

                // Status Distribution for Charts
                Map<String, Long> statusCounts = allRequests.stream()
                                .collect(Collectors.groupingBy(r -> r.getStatus() != null ? r.getStatus() : "UNKNOWN",
                                                Collectors.counting()));

                List<Map<String, Object>> statusData = new ArrayList<>();
                String[] colors = { "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#6366F1" };
                int i = 0;
                for (Map.Entry<String, Long> entry : statusCounts.entrySet()) {
                        statusData.add(Map.of(
                                        "label", entry.getKey(),
                                        "value", entry.getValue(),
                                        "color", colors[i % colors.length]));
                        i++;
                }

                Map<String, Object> response = new HashMap<>();
                response.put("kpi", kpi);
                response.put("statusData", statusData);
                // Mock trend for visual
                // Calculate basic daily trend from payments (last 7 days)
                List<Double> trend = new ArrayList<>();
                java.time.LocalDateTime now = java.time.LocalDateTime.now();
                for (int j = 6; j >= 0; j--) {
                        java.time.LocalDateTime start = now.minusDays(j).withHour(0).withMinute(0);
                        java.time.LocalDateTime end = now.minusDays(j).withHour(23).withMinute(59);
                        double daily = allPayments.stream()
                                        .filter(p -> p.getPaymentDate() != null &&
                                                        p.getPaymentDate().isAfter(start) &&
                                                        p.getPaymentDate().isBefore(end))
                                        .mapToDouble(Payment::getAmount).sum();
                        trend.add(daily);
                }
                response.put("trend", trend);

                return response;
        }

        @GetMapping("/finance")
        public Map<String, Object> getFinancialData() {
                List<Payment> allPayments = paymentRepository.findAll();

                double totalRevenue = allPayments.stream()
                                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                                .mapToDouble(Payment::getAmount)
                                .sum();

                long pendingCount = allPayments.stream()
                                .filter(p -> "Pending".equalsIgnoreCase(p.getPaymentStatus()))
                                .count();

                List<Map<String, Object>> transactions = allPayments.stream()
                                .map(p -> {
                                        Map<String, Object> txn = new HashMap<>();
                                        txn.put("id", "TXN-" + p.getId());
                                        txn.put("date", p.getPaymentDate() != null ? p.getPaymentDate().toString()
                                                        : "N/A");
                                        txn.put("client", p.getUser() != null ? p.getUser().getFullName() : "Unknown");
                                        txn.put("amount", p.getAmount());
                                        txn.put("status", p.getPaymentStatus());
                                        txn.put("method", p.getPaymentMethod());
                                        txn.put("type", "Credit");
                                        return txn;
                                })
                                .collect(Collectors.toList());

                Map<String, Object> stats = new HashMap<>();
                stats.put("revenue", Map.of("total", totalRevenue, "growth", 0.0)); // Calc growth vs last month?
                stats.put("pending", Map.of("total", 0, "count", pendingCount));
                stats.put("refunds", Map.of("total", 0, "count", 0));

                // Real MRR approx
                stats.put("mrr", Map.of("total", totalRevenue / 12.0, "growth", 0.0));

                Map<String, Object> response = new HashMap<>();
                response.put("stats", stats);
                response.put("transactions", transactions);
                response.put("invoices", new ArrayList<>());

                return response;
        }

        @Autowired
        private com.shinefiling.common.service.AuditLogService auditService;

        @GetMapping("/logs")
        public List<Map<String, Object>> getAuditLogs() {
                List<com.shinefiling.common.model.AuditLog> realLogs = auditService.getAllLogs();
                if (realLogs.isEmpty()) {
                        // Fallback if empty, maybe generate 1 system start log
                        return new ArrayList<>();
                }
                return realLogs.stream().map(log -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("id", "LOG-" + log.getId());
                        m.put("time", log.getTimestamp() != null ? log.getTimestamp().toString() : "");
                        m.put("type", log.getEventType());
                        // Parse severity/details from payloadJson if possible, or just dump payload
                        m.put("severity", "INFO"); // Default
                        m.put("user", log.getActor());
                        m.put("ip", "System");
                        m.put("action", log.getEventType());
                        m.put("details", log.getPayloadJson());
                        m.put("resource", "N/A");
                        return m;
                }).collect(Collectors.toList());
        }

        @GetMapping("/client-analysis")
        public Map<String, Object> getClientAnalysis() {
                List<User> allUsers = userRepository.findAll();
                List<ServiceRequest> allRequests = serviceRequestRepository.findAll();
                List<Payment> allPayments = paymentRepository.findAll(); // Updated to use Payment table for revenue

                // 1. Client Counts
                List<User> clients = allUsers.stream()
                                .filter(u -> "USER".equalsIgnoreCase(u.getRole()))
                                .collect(Collectors.toList());

                long totalClients = clients.size();

                java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
                long newClients = clients.stream()
                                .filter(u -> u.getCreatedAt() != null && u.getCreatedAt().isAfter(thirtyDaysAgo))
                                .count();

                // 2. Active Clients (clients with at least one request)
                Set<Long> activeClientIds = allRequests.stream()
                                .map(r -> r.getUser().getId())
                                .collect(Collectors.toSet());

                long activeClientCount = activeClientIds.size();

                // 3. Top Clients by Revenue
                Map<Long, Double> clientRevenue = allPayments.stream()
                                .filter(p -> "Success".equals(p.getPaymentStatus()))
                                .collect(Collectors.groupingBy(
                                                p -> p.getUser().getId(),
                                                Collectors.summingDouble(Payment::getAmount)));

                List<Map<String, Object>> topClients = clientRevenue.entrySet().stream()
                                .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                                .limit(5)
                                .map(entry -> {
                                        User u = userRepository.findById(entry.getKey()).orElse(null);
                                        Map<String, Object> clientMap = new HashMap<>();
                                        clientMap.put("id", entry.getKey());
                                        clientMap.put("name", u != null ? u.getFullName() : "Unknown");
                                        clientMap.put("email", u != null ? u.getEmail() : "Unknown");
                                        clientMap.put("spent", entry.getValue());
                                        clientMap.put("orders",
                                                        allRequests.stream().filter(
                                                                        r -> r.getUser().getId().equals(entry.getKey()))
                                                                        .count());
                                        return clientMap;
                                })
                                .collect(Collectors.toList());

                // 4. Response
                Map<String, Object> response = new HashMap<>();
                response.put("totalClients", totalClients);
                response.put("newClients", newClients);
                response.put("activeClients", activeClientCount);
                response.put("inactiveClients", totalClients - activeClientCount);
                response.put("topClients", topClients);

                // Mock Satisfaction metric for analysis visualization
                response.put("clientSatisfaction", Arrays.asList(
                                Map.of("rating", "5 Star", "count", 45),
                                Map.of("rating", "4 Star", "count", 30),
                                Map.of("rating", "3 Star", "count", 15),
                                Map.of("rating", "1-2 Star", "count", 5)));

                return response;
        }

        @PostMapping("/verify-docs/{submissionId}")
        public org.springframework.http.ResponseEntity<?> verifyDocs(@PathVariable String submissionId) {
                pvtLtdService.verifyDocuments(submissionId);
                return org.springframework.http.ResponseEntity.ok(Collections.singletonMap("message", "Verified"));
        }

        @PostMapping("/accept-doc/{submissionId}")
        public org.springframework.http.ResponseEntity<?> acceptDoc(@PathVariable String submissionId,
                        @RequestParam String docType) {
                pvtLtdService.acceptDocument(submissionId, docType);
                return org.springframework.http.ResponseEntity
                                .ok(Collections.singletonMap("message", "Document Accepted"));
        }

        @PostMapping("/reject-doc/{submissionId}")
        public org.springframework.http.ResponseEntity<?> rejectDoc(@PathVariable String submissionId,
                        @RequestBody Map<String, String> payload) {
                String docType = payload.get("docType");
                String reason = payload.get("reason");
                pvtLtdService.rejectDocument(submissionId, docType, reason);
                return org.springframework.http.ResponseEntity
                                .ok(Collections.singletonMap("message", "Document Rejected"));
        }

        @GetMapping("/download-docs/{submissionId}")
        public org.springframework.http.ResponseEntity<org.springframework.core.io.Resource> downloadDocuments(
                        @PathVariable String submissionId, @RequestParam(required = false) String type) {
                try {
                        com.shinefiling.business_reg.model.PrivateLimitedApplication app = pvtLtdService
                                        .getApplication(submissionId);
                        if (app == null) {
                                return org.springframework.http.ResponseEntity.notFound().build();
                        }

                        // Priority: Requested Type -> SUBMISSION_ZIP -> MOA -> First Available
                        String filePath = null;

                        // Check Generated Documents first
                        if (app.getGeneratedDocuments() != null && type != null
                                        && app.getGeneratedDocuments().containsKey(type)) {
                                String urlPath = app.getGeneratedDocuments().get(type);
                                filePath = urlPath.startsWith("/") ? urlPath.substring(1) : urlPath;
                        }
                        // Check Uploaded Documents next
                        else if (app.getUploadedDocuments() != null && type != null
                                        && app.getUploadedDocuments().containsKey(type)) {
                                String urlPath = app.getUploadedDocuments().get(type);
                                filePath = urlPath.startsWith("/") ? urlPath.substring(1) : urlPath;
                        }
                        // Fallbacks
                        else if (app.getGeneratedDocuments() != null
                                        && app.getGeneratedDocuments().containsKey("SUBMISSION_ZIP")) {
                                String urlPath = app.getGeneratedDocuments().get("SUBMISSION_ZIP");
                                filePath = urlPath.startsWith("/") ? urlPath.substring(1) : urlPath;
                        } else if (app.getGeneratedDocuments() != null
                                        && app.getGeneratedDocuments().containsKey("MOA")) {
                                String urlPath = app.getGeneratedDocuments().get("MOA");
                                String filename = urlPath.substring(urlPath.lastIndexOf("/") + 1);
                                filePath = "uploads/generated/" + filename;
                        } else if (app.getGeneratedDocuments() != null && !app.getGeneratedDocuments().isEmpty()) {
                                String urlPath = app.getGeneratedDocuments().values().iterator().next();
                                String filename = urlPath.substring(urlPath.lastIndexOf("/") + 1);
                                filePath = "uploads/generated/" + filename;
                        }

                        if (filePath == null) {
                                return org.springframework.http.ResponseEntity.notFound().build();
                        }

                        java.nio.file.Path path = java.nio.file.Paths.get(filePath);
                        org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                                        path.toUri());

                        if (resource.exists() || resource.isReadable()) {
                                return org.springframework.http.ResponseEntity.ok()
                                                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                                                                "attachment; filename=\"" + resource.getFilename()
                                                                                + "\"")
                                                .body(resource);
                        } else {
                                return org.springframework.http.ResponseEntity.notFound().build();
                        }

                } catch (Exception e) {
                        e.printStackTrace();
                        return org.springframework.http.ResponseEntity.internalServerError().build();
                }
        }

        @Autowired
        private com.shinefiling.common.service.automation.AutomationService automationService;

        @PostMapping("/orders/{orderId}/automation/start")
        public org.springframework.http.ResponseEntity<?> startAutomation(@PathVariable String orderId) {
                com.shinefiling.common.model.AutomationJob job = automationService.startAutomation(orderId,
                                "admin@shinefiling.com");
                return org.springframework.http.ResponseEntity.ok(job);
        }

        @GetMapping("/orders/{orderId}/automation/logs")
        public List<com.shinefiling.common.model.JobLog> getAutomationLogs(@PathVariable String orderId) {
                // Find latest job for this order
                com.shinefiling.common.model.AutomationJob job = automationService.getLatestJobForOrder(orderId);
                if (job == null)
                        return new ArrayList<>();

                return jobLogRepository.findByAutomationJobId(job.getId());
        }

        @PostMapping("/gov-submission/{submissionId}")
        public org.springframework.http.ResponseEntity<?> markGovSubmitted(@PathVariable String submissionId,
                        @RequestParam String srn) {
                pvtLtdService.markGovSubmitted(submissionId, srn);
                return org.springframework.http.ResponseEntity
                                .ok(Collections.singletonMap("message", "Marked as Gov Submitted"));
        }

        @PostMapping("/upload-certificate/{submissionId}")
        public org.springframework.http.ResponseEntity<?> uploadCertificate(@PathVariable String submissionId,
                        @RequestParam("file") MultipartFile file) {
                try {
                        if (file.isEmpty())
                                return org.springframework.http.ResponseEntity.badRequest().body("File is empty");

                        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads/certificates");
                        if (!java.nio.file.Files.exists(uploadDir))
                                java.nio.file.Files.createDirectories(uploadDir);

                        java.nio.file.Path targetPath = uploadDir.resolve(filename);
                        java.nio.file.Files.copy(file.getInputStream(), targetPath,
                                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);

                        pvtLtdService.completeApplication(submissionId, "/uploads/certificates/" + filename);

                        return org.springframework.http.ResponseEntity.ok(
                                        Collections.singletonMap("message", "Certificate Uploaded. Order Completed."));
                } catch (Exception e) {
                        return org.springframework.http.ResponseEntity.internalServerError()
                                        .body("Upload failed: " + e.getMessage());
                }
        }

        @GetMapping("/services")
        public List<com.shinefiling.common.model.ServiceProduct> getServiceCatalog() {
                long count = serviceProductRepository.count();
                System.out.println("Fetching Service Catalog from DB. Total items: " + count);
                if (count == 0) {
                        System.out.println("Catalog empty. Attempting re-seed...");
                        initServiceCatalog();
                        return serviceProductRepository.findAll();
                }
                return serviceProductRepository.findAll();
        }

        @PostMapping("/services/seed")
        public org.springframework.http.ResponseEntity<?> forceSeed() {
                System.out.println("Force Seeding Service Catalog...");
                if (serviceProductRepository.count() > 0) {
                        serviceProductRepository.deleteAll();
                }
                initServiceCatalog();
                return org.springframework.http.ResponseEntity
                                .ok("Seeded " + serviceProductRepository.count() + " items");
        }

        @PutMapping("/services/{id}")
        public org.springframework.http.ResponseEntity<?> updateServiceProduct(@PathVariable String id,
                        @RequestBody Map<String, Object> updates) {
                Optional<com.shinefiling.common.model.ServiceProduct> opt = serviceProductRepository.findById(id);
                if (opt.isPresent()) {
                        com.shinefiling.common.model.ServiceProduct product = opt.get();
                        if (updates.containsKey("status"))
                                product.setStatus((String) updates.get("status"));
                        if (updates.containsKey("price"))
                                product.setPrice(Double.valueOf(String.valueOf(updates.get("price"))));
                        if (updates.containsKey("name"))
                                product.setName((String) updates.get("name"));

                        serviceProductRepository.save(product);
                        return org.springframework.http.ResponseEntity.ok(product);
                }
                return org.springframework.http.ResponseEntity.notFound().build();
        }

        private void addServices(List<com.shinefiling.common.model.ServiceProduct> catalog, String catId,
                        String catName,
                        String color,
                        List<String> items) {
                int i = 0;
                for (String item : items) {
                        catalog.add(new com.shinefiling.common.model.ServiceProduct(
                                        catId + "_" + i,
                                        item,
                                        catName,
                                        catId,
                                        (double) ((i + 1) * 999 + 499),
                                        (3 + i) + " - " + (5 + i) + " Days",
                                        2 + (i % 3),
                                        "ACTIVE",
                                        color));
                        i++;
                }
        }

        @GetMapping("/departments")
        public List<Map<String, Object>> getDepartments() {
                List<Map<String, Object>> depts = new ArrayList<>();
                depts.add(Map.of("id", 1, "name", "Legal Board", "count", 12, "head", "Adv. Sharma", "color",
                                "bg-indigo-50 text-indigo-700"));
                depts.add(Map.of("id", 2, "name", "Support Ops", "count", 8, "head", "Priya K.", "color",
                                "bg-pink-50 text-pink-700"));
                depts.add(Map.of("id", 3, "name", "Finance", "count", 4, "head", "Amit R.", "color",
                                "bg-emerald-50 text-emerald-700"));
                depts.add(Map.of("id", 4, "name", "Tech Team", "count", 6, "head", "Suresh V.", "color",
                                "bg-blue-50 text-blue-700"));
                return depts;
        }

        @GetMapping("/settings")
        public Map<String, Object> getSettings() {
                // Mock System Settings
                return Map.of(
                                "maintenanceMode", false,
                                "publicRegistration", true,
                                "twoFactorAuth", false,
                                "debugMode", true);
        }

        @PutMapping("/settings")
        public org.springframework.http.ResponseEntity<?> updateSettings(@RequestBody Map<String, Object> settings) {
                // In a real app, save to GlobalConfig table. For now, mock success.
                return org.springframework.http.ResponseEntity.ok(settings);
        }

        @Autowired
        private com.shinefiling.common.repository.ChatRepository chatRepository;

        @Autowired
        private com.shinefiling.licenses.repository.FssaiApplicationRepository fssaiApplicationRepository;

        @Autowired
        private com.shinefiling.business_reg.repository.PrivateLimitedApplicationRepository pvtLtdRepository;

        @Autowired
        private com.shinefiling.common.repository.JobLogRepository jobLogRepository;

        @Autowired
        private com.shinefiling.common.repository.StatusLogRepository statusLogRepository;

        @Autowired
        private com.shinefiling.common.repository.AutomationJobRepository automationJobRepository;

        @Autowired
        private com.shinefiling.common.repository.GeneratedDocumentRepository generatedDocumentRepository;

        @Autowired
        private com.shinefiling.common.repository.NotificationRepository notificationRepository;

        @Autowired
        private com.shinefiling.common.repository.AuditLogRepository auditLogRepository;

        @Autowired
        private StoredFileRepository storedFileRepository;

        @Autowired
        private DocumentRepository documentRepository;

        @Autowired
        private com.shinefiling.licenses.repository.TradeLicenseRepository tradeLicenseRepository;

        @DeleteMapping("/orders/{idRaw}")
        public org.springframework.http.ResponseEntity<?> deleteOrder(@PathVariable String idRaw) {
                System.out.println("DELETE ORDER REQUEST: " + idRaw);
                try {
                        String submissionId = idRaw.trim();

                        // Variations to try (Fuzzy Matching)
                        List<String> idsToTry = new ArrayList<>();
                        idsToTry.add(submissionId);
                        if (!submissionId.startsWith("ORD-"))
                                idsToTry.add("ORD-" + submissionId);
                        if (submissionId.startsWith("ORD-"))
                                idsToTry.add(submissionId.replace("ORD-", ""));

                        boolean found = false;

                        // 1. Try Generic ServiceRequest (Numeric ID check)
                        for (String id : idsToTry) {
                                Long sId = null;
                                try {
                                        sId = Long.parseLong(id);
                                } catch (Exception e) {
                                }

                                if (sId != null) {
                                        Optional<ServiceRequest> reqOpt = serviceRequestRepository.findById(sId);
                                        if (reqOpt.isPresent()) {
                                                ServiceRequest req = reqOpt.get();
                                                String strId = req.getId().toString();

                                                // Deep Cleanup
                                                performDeepCleanup(strId);
                                                performDeepCleanup("ORD-" + strId); // Try prefixed too

                                                // Specific Generic Cleanup
                                                try {
                                                        pvtLtdRepository.deleteBySubmissionId(strId);
                                                } catch (Exception e) {
                                                } // Logic variation

                                                serviceRequestRepository.delete(req);
                                                return org.springframework.http.ResponseEntity.ok(Collections
                                                                .singletonMap("message", "Order deleted (Generic)"));
                                        }
                                }
                        }

                        // 2. Try Specialized Repos
                        for (String id : idsToTry) {
                                if (found)
                                        break;

                                // Perform cleanup for this ID variation first
                                performDeepCleanup(id);

                                // Trade License
                                try {
                                        com.shinefiling.licenses.model.TradeLicenseApplication trade = tradeLicenseRepository
                                                        .findBySubmissionId(id);
                                        if (trade != null) {
                                                tradeLicenseRepository.delete(trade);
                                                found = true;
                                                break;
                                        }
                                } catch (Exception e) {
                                }

                                // FSSAI
                                if (!found) {
                                        try {
                                                com.shinefiling.licenses.model.FssaiApplication fssai = fssaiApplicationRepository
                                                                .findBySubmissionId(id);
                                                if (fssai != null) {
                                                        // Native query cleanup for specific child tables if needed, but
                                                        // depend on cascade mostly or deep cleanup
                                                        fssaiApplicationRepository.delete(fssai);
                                                        found = true;
                                                        break;
                                                }
                                        } catch (Exception e) {
                                        }
                                }

                                // Pvt Ltd
                                if (!found) {
                                        try {
                                                com.shinefiling.business_reg.model.PrivateLimitedApplication pvt = pvtLtdRepository
                                                                .findBySubmissionId(id);
                                                if (pvt != null) {
                                                        if (pvt.getServiceRequestId() != null) {
                                                                try {
                                                                        serviceRequestRepository.deleteById(
                                                                                        pvt.getServiceRequestId());
                                                                } catch (Exception ex) {
                                                                }
                                                        }
                                                        pvtLtdRepository.delete(pvt);
                                                        found = true;
                                                        break;
                                                }
                                        } catch (Exception e) {
                                        }
                                }
                        }

                        if (found) {
                                return org.springframework.http.ResponseEntity.ok(Collections.singletonMap("message",
                                                "Order and all related data deleted."));
                        }

                        return org.springframework.http.ResponseEntity.notFound().build();

                } catch (Exception e) {
                        e.printStackTrace();
                        return org.springframework.http.ResponseEntity.internalServerError()
                                        .body("Failed to delete order: " + e.getMessage());
                }
        }

        private void performDeepCleanup(String orderId) {
                // 1. Chats
                try {
                        chatRepository.deleteAll(chatRepository.findBySubmissionIdOrderByTimestampAsc(orderId));
                } catch (Exception e) {
                }

                // 2. Documents (if mapped by string ID or numeric)
                try {
                        Long numId = Long.parseLong(orderId.replace("ORD-", ""));
                        documentRepository.deleteAll(documentRepository.findByServiceRequestId(numId));
                        paymentRepository.deleteAll(paymentRepository.findByServiceRequestId(numId));
                        auditLogRepository.deleteAll(auditLogRepository.findByServiceRequestId(numId));
                        statusLogRepository.deleteAll(statusLogRepository.findByOrder_IdOrderByChangedAtDesc(numId));
                } catch (Exception e) {
                }

                // 4. Automation Jobs & Logs
                try {
                        com.shinefiling.common.model.AutomationJob job = automationJobRepository
                                        .findTopByOrderIdOrderByCreatedAtDesc(orderId);
                        if (job != null) {
                                jobLogRepository.deleteAll(jobLogRepository.findByAutomationJobId(job.getId()));
                                automationJobRepository.delete(job);
                        }
                } catch (Exception e) {
                }

                // 5. Notifications
                try {
                        notificationRepository.deleteAll(notificationRepository.findByReferenceId(orderId));
                } catch (Exception e) {
                }

        }

        @PostMapping("/delete-all-chats")
        public org.springframework.http.ResponseEntity<?> deleteAllChats(@RequestBody Map<String, String> payload) {
                String password = payload.get("password");
                if (!"admin@123".equals(password)) {
                        return org.springframework.http.ResponseEntity.status(403)
                                        .body(Collections.singletonMap("error", "Invalid Password"));
                }

                try {
                        chatRepository.deleteAll();

                        // Physical Cleanup
                        try {
                                deleteDirectoryRecursively(java.nio.file.Paths.get("uploads/chats"));
                        } catch (Exception ex) {
                                System.err.println("Warning: Could not delete chat files: " + ex.getMessage());
                        }

                        return org.springframework.http.ResponseEntity
                                        .ok(Collections.singletonMap("message",
                                                        "All chats and history deleted successfully."));
                } catch (Exception e) {
                        return org.springframework.http.ResponseEntity.internalServerError()
                                        .body("Failed to delete chats: " + e.getMessage());
                }
        }

        @GetMapping("/applications")
        public List<Map<String, Object>> getAllApplications() {
                List<Map<String, Object>> result = new ArrayList<>();

                // 1. Generic Service Requests
                List<ServiceRequest> requests = serviceRequestRepository.findAll();
                for (ServiceRequest r : requests) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", r.getId());
                        map.put("serviceName", r.getServiceName());
                        map.put("status", r.getStatus());
                        map.put("createdAt", r.getCreatedAt());
                        map.put("user", r.getUser());
                        map.put("amount", r.getAmount());
                        result.add(map);
                }

                // 2. Pvt Ltd Applications
                List<com.shinefiling.business_reg.model.PrivateLimitedApplication> pvtApps = pvtLtdService
                                .getAllApplications();
                for (com.shinefiling.business_reg.model.PrivateLimitedApplication r : pvtApps) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", r.getSubmissionId()); // Use String ID
                        map.put("serviceName", "Private Limited Registration");
                        map.put("status", r.getStatus());
                        map.put("createdAt", r.getCreatedAt());
                        map.put("user", r.getUser());
                        result.add(map);
                }

                // 3. FSSAI Applications
                List<com.shinefiling.licenses.model.FssaiApplication> fssaiApps = fssaiApplicationRepository.findAll();
                for (com.shinefiling.licenses.model.FssaiApplication r : fssaiApps) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", r.getId());
                        map.put("serviceName", "FSSAI License");
                        map.put("status", r.getStatus());
                        map.put("createdAt", r.getCreatedAt());
                        map.put("user", r.getUser());
                        result.add(map);
                }

                // 4. Trade Licenses
                List<com.shinefiling.licenses.model.TradeLicenseApplication> tradeApps = tradeLicenseRepository
                                .findAll();
                for (com.shinefiling.licenses.model.TradeLicenseApplication r : tradeApps) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", r.getId());
                        map.put("serviceName", "Trade License");
                        map.put("status", r.getStatus());
                        map.put("createdAt", r.getCreatedAt());
                        map.put("user", r.getUser());
                        result.add(map);
                }

                // Sort by Date Descending
                result.sort((a, b) -> {
                        String d1 = a.get("createdAt") != null ? a.get("createdAt").toString() : "";
                        String d2 = b.get("createdAt") != null ? b.get("createdAt").toString() : "";
                        return d2.compareTo(d1);
                });

                return result;
        }

        @Autowired
        private com.shinefiling.common.repository.AutomationWorkflowRepository automationWorkflowRepository;

        // --- AUTOMATION WORKFLOWS ---

        @GetMapping("/automation/workflows")
        public List<com.shinefiling.common.model.AutomationWorkflow> getWorkflows() {
                return automationWorkflowRepository.findAll();
        }

        @PostMapping("/automation/workflows")
        public com.shinefiling.common.model.AutomationWorkflow createWorkflow(
                        @RequestBody com.shinefiling.common.model.AutomationWorkflow workflow) {
                return automationWorkflowRepository.save(workflow);
        }

        @PutMapping("/automation/workflows/{id}")
        public com.shinefiling.common.model.AutomationWorkflow updateWorkflow(@PathVariable Long id,
                        @RequestBody com.shinefiling.common.model.AutomationWorkflow details) {
                return automationWorkflowRepository.findById(id).map(w -> {
                        w.setName(details.getName());
                        w.setTriggerType(details.getTriggerType());
                        w.setSteps(details.getSteps());
                        w.setStatus(details.getStatus());
                        w.setUpdatedAt(java.time.LocalDateTime.now());
                        return automationWorkflowRepository.save(w);
                }).orElse(null);
        }

        @GetMapping("/automation/logs/system")
        public List<Map<String, Object>> getSystemLogs() {
                return new ArrayList<>(); // Stub
        }

        private void deleteDirectoryRecursively(java.nio.file.Path path) {
                if (!java.nio.file.Files.exists(path))
                        return;
                try (java.util.stream.Stream<java.nio.file.Path> walk = java.nio.file.Files.walk(path)) {
                        walk.sorted(java.util.Comparator.reverseOrder())
                                        .forEach(p -> {
                                                try {
                                                        java.nio.file.Files.delete(p);
                                                } catch (java.io.IOException e) {
                                                        System.err.println("Failed to delete: " + p + " "
                                                                        + e.getMessage());
                                                }
                                        });
                } catch (java.io.IOException e) {
                        System.err.println("Error walking directory: " + path + " " + e.getMessage());
                }
        }
}
