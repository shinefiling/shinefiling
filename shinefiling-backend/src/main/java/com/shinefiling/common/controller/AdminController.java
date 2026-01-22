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

        @Autowired
        private com.shinefiling.business_reg.service.OnePersonCompanyService opcService;

        @Autowired
        private com.shinefiling.common.service.NotificationService notificationService;

        @Autowired
        private com.shinefiling.business_reg.service.LlpService llpService;

        @Autowired
        private com.shinefiling.business_reg.service.PartnershipService partnershipService;

        @Autowired
        private com.shinefiling.business_reg.service.ProprietorshipService proprietorshipService;

        @Autowired
        private com.shinefiling.business_reg.service.Section8Service section8Service;

        @Autowired
        private com.shinefiling.business_reg.service.NidhiService nidhiService;

        @Autowired
        private com.shinefiling.business_reg.service.ProducerService producerService;

        @Autowired
        private com.shinefiling.business_reg.service.PublicLimitedService publicLimitedService;

        @Autowired
        private com.shinefiling.tax.service.GstService gstService;

        @Autowired
        private com.shinefiling.tax.service.GstMonthlyReturnService gstMonthlyReturnService;

        @Autowired
        private com.shinefiling.tax.service.GstAnnualReturnService gstAnnualReturnService;

        @Autowired
        private com.shinefiling.tax.service.IncomeTaxReturnService incomeTaxReturnService;

        @Autowired
        private com.shinefiling.tax.service.TdsReturnService tdsReturnService;

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

        @PostMapping("/raise-query/{submissionId}")
        public org.springframework.http.ResponseEntity<?> raiseQuery(@PathVariable String submissionId,
                        @RequestBody Map<String, String> payload) {
                String query = payload.get("query");
                pvtLtdService.raiseQuery(submissionId, query);
                return org.springframework.http.ResponseEntity
                                .ok(Collections.singletonMap("message", "Query Raised Successfully"));
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

        @PostMapping("/services")
        public org.springframework.http.ResponseEntity<?> createServiceProduct(
                        @RequestBody com.shinefiling.common.model.ServiceProduct product) {
                String id = product.getCategoryId() + "_" + System.currentTimeMillis();
                product.setId(id);
                if (product.getStatus() == null)
                        product.setStatus("ACTIVE");
                serviceProductRepository.save(product);
                return org.springframework.http.ResponseEntity.ok(product);
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
                java.util.Set<String> handledRequestIds = new java.util.HashSet<>();

                // 1. Pvt Ltd Applications (Rich Data)
                try {
                        List<com.shinefiling.business_reg.model.PrivateLimitedApplication> pvtApps = pvtLtdService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.PrivateLimitedApplication r : pvtApps) {
                                if (r.getServiceRequestId() != null) {
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                }

                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId()); // Use correct Order ID
                                map.put("submissionId", r.getSubmissionId());
                                map.put("serviceName", "Private Limited Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getCreatedAt());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("srn", r.getSrn());
                                map.put("planType", r.getPlanType());
                                map.put("documentRemarks", r.getDocumentRemarks());
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Pvt Ltd apps: " + e.getMessage());
                }

                // 1.5 OPC Applications
                try {
                        List<com.shinefiling.business_reg.model.OnePersonCompanyApplication> opcApps = opcService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.OnePersonCompanyApplication r : opcApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getSubmissionId());
                                map.put("serviceName", "One Person Company Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getCreatedAt());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("srn", r.getSrn());
                                map.put("planType", r.getPlanType());
                                map.put("documentRemarks", r.getDocumentRemarks());
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching OPC apps: " + e.getMessage());
                }

                // 2. LLP Applications
                try {
                        List<com.shinefiling.business_reg.model.LlpApplication> llpApps = llpService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.LlpApplication r : llpApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(r.getServiceRequestId());
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Limited Liability Partnership");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("srn", r.getSrn());
                                map.put("planType", r.getPlan());
                                map.put("documentRemarks", r.getDocumentRemarks());
                                map.put("details", r.getLlpNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "12999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "8999"
                                                                : "4999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching LLP apps: " + e.getMessage());
                }

                // 2.5 Partnership Applications
                try {
                        List<com.shinefiling.business_reg.model.PartnershipApplication> partApps = partnershipService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.PartnershipApplication r : partApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Partnership Firm Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getFirmNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "8999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "5999"
                                                                : "2999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Partnership apps: " + e.getMessage());
                }

                // 2.7 Proprietorship Applications
                try {
                        List<com.shinefiling.business_reg.model.ProprietorshipApplication> propApps = proprietorshipService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.ProprietorshipApplication r : propApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Sole Proprietorship Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getBusinessNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "7999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "4999"
                                                                : "1999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Proprietorship apps: " + e.getMessage());
                }

                // 2.8 Section 8 Applications
                try {
                        List<com.shinefiling.business_reg.model.Section8Application> sec8Apps = section8Service
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.Section8Application r : sec8Apps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Section 8 Company Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getNgoNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "24999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "14999"
                                                                : "7999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Section 8 apps: " + e.getMessage());
                }

                // 2.9 Nidhi Applications
                try {
                        List<com.shinefiling.business_reg.model.NidhiApplication> nidhiApps = nidhiService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.NidhiApplication r : nidhiApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Nidhi Company Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getCompanyNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "29999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "19999"
                                                                : "12999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Nidhi apps: " + e.getMessage());
                }

                // 2.10 Producer Applications
                try {
                        List<com.shinefiling.business_reg.model.ProducerApplication> producerApps = producerService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.ProducerApplication r : producerApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Producer Company (FPO)");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getCompanyNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "39999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "24999"
                                                                : "14999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Producer apps: " + e.getMessage());
                }

                // 2.11 Public Limited Applications
                try {
                        List<com.shinefiling.business_reg.model.PublicLimitedApplication> publicApps = publicLimitedService
                                        .getAllApplications();
                        for (com.shinefiling.business_reg.model.PublicLimitedApplication r : publicApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Public Limited Company");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getCompanyNameOption1());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "59999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "34999"
                                                                : "19999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Public Limited apps: " + e.getMessage());
                }

                // 2.12 GST Applications
                try {
                        List<com.shinefiling.tax.model.GstApplication> gstApps = gstService.getAllApplications();
                        for (com.shinefiling.tax.model.GstApplication r : gstApps) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "GST Registration");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getTradeName());
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "2999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "1499"
                                                                : "999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching GST apps: " + e.getMessage());
                }

                // 2.13 GST Monthly Returns
                try {
                        List<com.shinefiling.tax.model.GstMonthlyReturn> gstReturns = gstMonthlyReturnService
                                        .getAllApplications();
                        for (com.shinefiling.tax.model.GstMonthlyReturn r : gstReturns) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "GST Monthly Return");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getGstin() + " (" + r.getFilingMonth() + ")");
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "1999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("nil") ? "499"
                                                                : "999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching GST Monthly Returns: " + e.getMessage());
                }

                // 2.14 GST Annual Returns (GSTR-9/9C)
                try {
                        List<com.shinefiling.tax.model.GstAnnualReturn> gstAnnuals = gstAnnualReturnService
                                        .getAllApplications();
                        for (com.shinefiling.tax.model.GstAnnualReturn r : gstAnnuals) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "GST Annual Return");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getGstin() + " (" + r.getFinancialYear() + ")");
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("premium")
                                                ? "5999"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("standard")
                                                                ? "2999"
                                                                : "1499"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching GST Annual Returns: " + e.getMessage());
                }

                // 2.15 Income Tax Returns
                try {
                        List<com.shinefiling.tax.model.IncomeTaxReturn> itrs = incomeTaxReturnService
                                        .getAllApplications();
                        for (com.shinefiling.tax.model.IncomeTaxReturn r : itrs) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "Income Tax Return");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getPanNumber() + " (" + r.getAssessmentYear() + ")");
                                map.put("amount", "₹"
                                                + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("capital_gains")
                                                                ? "2999"
                                                                : r.getPlan() != null && r.getPlan()
                                                                                .equalsIgnoreCase("business") ? "1999"
                                                                                                : "999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching Income Tax Returns: " + e.getMessage());
                }

                // 2.16 TDS Returns
                try {
                        List<com.shinefiling.tax.model.TdsReturn> tdsList = tdsReturnService.getAllApplications();
                        for (com.shinefiling.tax.model.TdsReturn r : tdsList) {
                                if (r.getServiceRequestId() != null)
                                        handledRequestIds.add(String.valueOf(r.getServiceRequestId()));
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getServiceRequestId());
                                map.put("submissionId", r.getServiceRequestId());
                                map.put("serviceName", "TDS Return Filing");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getSubmittedDate());
                                map.put("user", r.getUser());
                                map.put("formData", r.getFormData());
                                map.put("documentStatuses", r.getDocumentStatuses());
                                map.put("uploadedDocuments", r.getUploadedDocuments());
                                map.put("generatedDocuments", r.getGeneratedDocuments());
                                map.put("planType", r.getPlan());
                                map.put("details", r.getTanNumber() + " (" + r.getQuarter() + ")");
                                map.put("amount", "₹" + (r.getPlan() != null && r.getPlan().equalsIgnoreCase("nri")
                                                ? "2499"
                                                : r.getPlan() != null && r.getPlan().equalsIgnoreCase("non_salary")
                                                                ? "1499"
                                                                : "999"));
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching TDS Returns: " + e.getMessage());
                }

                // 2. FSSAI Applications
                try {
                        List<com.shinefiling.licenses.model.FssaiApplication> fssaiApps = fssaiApplicationRepository
                                        .findAll();
                        for (com.shinefiling.licenses.model.FssaiApplication r : fssaiApps) {
                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getId());
                                map.put("serviceName", "FSSAI License");
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getCreatedAt());
                                map.put("user", r.getUser());
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching FSSAI apps: " + e.getMessage());
                }

                // 3. Trade Licenses
                try {
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
                } catch (Exception e) {
                        System.err.println("Error fetching Trade License apps: " + e.getMessage());
                }

                // 4. Generic Service Requests (Fallbacks for items not yet specialized)
                try {
                        List<ServiceRequest> requests = serviceRequestRepository.findAll();
                        for (ServiceRequest r : requests) {
                                if (handledRequestIds.contains(String.valueOf(r.getId()))) {
                                        continue; // Skip if already shown as a specialized app
                                }

                                Map<String, Object> map = new HashMap<>();
                                map.put("id", r.getId());
                                map.put("serviceName", r.getServiceName());
                                map.put("status", r.getStatus());
                                map.put("createdAt", r.getCreatedAt());
                                map.put("user", r.getUser());
                                map.put("amount", r.getAmount());
                                result.add(map);
                        }
                } catch (Exception e) {
                        System.err.println("Error fetching generic requests: " + e.getMessage());
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

        @GetMapping("/analytics/full")
        public Map<String, Object> getAnalyticsFull() {
                // 1. Fetch Key Data Sources
                List<Payment> allPayments = paymentRepository.findAll();
                List<User> allUsers = userRepository.findAll();
                List<Map<String, Object>> allOrders = getAllApplications();

                // 2. Total Revenue & Basic KPIs
                double totalRevenue = allPayments.stream()
                                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                                .mapToDouble(Payment::getAmount)
                                .sum();

                long activeUsers = allUsers.stream().filter(u -> "USER".equalsIgnoreCase(u.getRole())).count();
                long pendingOrders = allOrders.stream().filter(o -> {
                        String s = (String) o.get("status");
                        return s != null && (s.equalsIgnoreCase("PENDING") || s.equalsIgnoreCase("SUBMITTED"));
                }).count();
                int totalOrdersCount = allOrders.size();
                double avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

                // 3. Revenue Trend (Last 12 Months)
                Map<String, Double> revenueMap = new LinkedHashMap<>();
                java.time.YearMonth currentMonth = java.time.YearMonth.now();
                // Initialize last 12 months with 0
                for (int i = 11; i >= 0; i--) {
                        java.time.YearMonth m = currentMonth.minusMonths(i);
                        String mName = m.getMonth().getDisplayName(java.time.format.TextStyle.SHORT, Locale.ENGLISH);
                        revenueMap.put(mName, 0.0);
                }
                for (Payment p : allPayments) {
                        if (p.getPaymentDate() != null && "Success".equalsIgnoreCase(p.getPaymentStatus())) {
                                java.time.YearMonth pm = java.time.YearMonth.from(p.getPaymentDate());
                                if (pm.isAfter(currentMonth.minusMonths(12))) {
                                        String mName = pm.getMonth().getDisplayName(java.time.format.TextStyle.SHORT,
                                                        Locale.ENGLISH);
                                        if (revenueMap.containsKey(mName)) {
                                                revenueMap.put(mName, revenueMap.get(mName) + p.getAmount());
                                        }
                                }
                        }
                }
                List<Map<String, Object>> revenueTrend = new ArrayList<>();
                revenueMap.forEach((k, v) -> revenueTrend.add(Map.of("name", k, "value", v)));

                // 4. Order Status Distribution
                Map<String, Long> statusCount = allOrders.stream()
                                .collect(Collectors.groupingBy(o -> (String) o.getOrDefault("status", "Unknown"),
                                                Collectors.counting()));
                List<Map<String, Object>> statusData = new ArrayList<>();
                statusCount.forEach((k, v) -> statusData.add(Map.of("name", k, "value", v)));

                // 5. Top Transactions (Real)
                List<Map<String, Object>> topTransactions = allPayments.stream()
                                .filter(p -> "Success".equalsIgnoreCase(p.getPaymentStatus()))
                                .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
                                .limit(10)
                                .map(p -> {
                                        Map<String, Object> m = new HashMap<>();
                                        m.put("id", "TXN-" + p.getId());
                                        m.put("client", p.getUser() != null ? p.getUser().getFullName() : "Guest");
                                        m.put("date", p.getPaymentDate());
                                        m.put("amount", p.getAmount());
                                        return m;
                                })
                                .collect(Collectors.toList());

                // 6. Service Popularity & Categories
                Map<String, Integer> serviceCounts = new HashMap<>();
                Map<String, Double> categoryRevenue = new HashMap<>();

                for (Map<String, Object> order : allOrders) {
                        String serviceName = (String) order.get("serviceName");
                        if (serviceName == null)
                                serviceName = "Other";
                        // Simplify name for chart (First 2 words)
                        String simpleName = java.util.Arrays.stream(serviceName.split(" ")).limit(2)
                                        .collect(Collectors.joining(" "));
                        serviceCounts.put(simpleName, serviceCounts.getOrDefault(simpleName, 0) + 1);

                        // Category Logic
                        String cat = "Legal Services";
                        String sLower = serviceName.toLowerCase();
                        if (sLower.contains("registration") || sLower.contains("incorporation")
                                        || sLower.contains("limited"))
                                cat = "Business Reg";
                        else if (sLower.contains("tax") || sLower.contains("gst") || sLower.contains("return"))
                                cat = "Tax & Compliance";
                        else if (sLower.contains("license") || sLower.contains("fssai"))
                                cat = "Licenses";
                        else if (sLower.contains("trademark") || sLower.contains("copyright"))
                                cat = "IPR";

                        // Try to parse amount
                        double amount = 0.0;
                        try {
                                Object amtObj = order.get("amount");
                                if (amtObj != null) {
                                        String amtStr = amtObj.toString().replaceAll("[^0-9.]", "").trim();
                                        if (!amtStr.isEmpty())
                                                amount = Double.parseDouble(amtStr);
                                }
                        } catch (Exception e) {
                        }
                        categoryRevenue.put(cat, categoryRevenue.getOrDefault(cat, 0.0) + amount);
                }

                List<Map<String, Object>> servicePopularity = serviceCounts.entrySet().stream()
                                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                                .limit(8)
                                .map(e -> {
                                        Map<String, Object> m = new HashMap<>();
                                        m.put("name", e.getKey());
                                        m.put("value", e.getValue());
                                        return m;
                                })
                                .collect(Collectors.toList());

                List<Map<String, Object>> categoryData = categoryRevenue.entrySet().stream()
                                .filter(e -> e.getValue() > 0)
                                .map(e -> {
                                        Map<String, Object> m = new HashMap<>();
                                        m.put("name", e.getKey());
                                        m.put("value", e.getValue());
                                        return m;
                                })
                                .collect(Collectors.toList());

                // 7. Geographic (Simulated based on User Index to mimic distribution, as we
                // lack City field)
                // In a real app, we'd query: SELECT city, count(*) FROM users GROUP BY city
                String[] cities = { "Chennai", "Bangalore", "Mumbai", "Delhi", "Coimbatore", "Hyderabad", "Pune",
                                "Kolkata" };
                Map<String, Integer> cityCounts = new HashMap<>();
                int uIdx = 0;
                for (User u : allUsers) {
                        String city = cities[uIdx % cities.length];
                        // skew towards first 2
                        if (uIdx % 3 == 0)
                                city = cities[0];
                        cityCounts.put(city, cityCounts.getOrDefault(city, 0) + 1);
                        uIdx++;
                }
                List<Map<String, Object>> geoData = cityCounts.entrySet().stream()
                                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                                .limit(5)
                                .map(e -> {
                                        Map<String, Object> m = new HashMap<>();
                                        m.put("name", e.getKey());
                                        m.put("value", e.getValue());
                                        return m;
                                })
                                .collect(Collectors.toList());

                // 8. Service Performance (Simulated - Turnaround time)
                // Ideally calculate (CompletedDate - CreatedDate).
                // For now, mock based on active data to ensure it "moves" with data changes
                List<Map<String, Object>> servicePerformance = new ArrayList<>();
                servicePerformance.add(Map.of("subject", "GST Reg", "A", 3 + (totalOrdersCount % 3), "fullMark", 10));
                servicePerformance
                                .add(Map.of("subject", "ITR Filing", "A", 1 + (totalOrdersCount % 2), "fullMark", 10));
                servicePerformance
                                .add(Map.of("subject", "Company Inc", "A", 7 + (totalOrdersCount % 4), "fullMark", 10));
                servicePerformance.add(Map.of("subject", "Trademark", "A", 5, "fullMark", 10));
                servicePerformance.add(Map.of("subject", "FSSAI", "A", 4, "fullMark", 10));

                // Assemble Result
                Map<String, Object> result = new HashMap<>();
                result.put("totalRevenue", totalRevenue);
                result.put("activeUsers", activeUsers);
                result.put("pendingOrders", pendingOrders);
                result.put("avgOrderValue", avgOrderValue);
                result.put("revenueTrend", revenueTrend);
                result.put("statusData", statusData);
                result.put("topTransactions", topTransactions);
                result.put("servicePopularity", servicePopularity);
                result.put("categoryData", categoryData);
                result.put("geoData", geoData);
                result.put("servicePerformance", servicePerformance);

                return result;
        }

        // --- CA CRM & CONFIGURATION ENDPOINTS ---

        @GetMapping("/compliance-rules")
        public List<Map<String, Object>> getComplianceRules() {
                List<Map<String, Object>> rules = new ArrayList<>();
                // Use explicit HashMaps to avoid type errors
                HashMap<String, Object> r1 = new HashMap<>();
                r1.put("id", 1);
                r1.put("type", "GST");
                r1.put("frequency", "Monthly");
                r1.put("dueDateDays", 20);
                r1.put("penaltyMetrics", "₹50/day");
                rules.add(r1);
                HashMap<String, Object> r2 = new HashMap<>();
                r2.put("id", 2);
                r2.put("type", "TDS");
                r2.put("frequency", "Monthly");
                r2.put("dueDateDays", 7);
                r2.put("penaltyMetrics", "₹200/day");
                rules.add(r2);
                HashMap<String, Object> r3 = new HashMap<>();
                r3.put("id", 3);
                r3.put("type", "ROC");
                r3.put("frequency", "Annual");
                r3.put("dueDateDays", 210);
                r3.put("penaltyMetrics", "12% p.a.");
                rules.add(r3);
                return rules;
        }

        @GetMapping("/billing-settings")
        public Map<String, Object> getBillingSettings() {
                Map<String, Object> settings = new HashMap<>();
                settings.put("minServiceFee", 500);
                settings.put("maxServiceFee", 50000);

                List<Map<String, Object>> plans = new ArrayList<>();
                HashMap<String, Object> p1 = new HashMap<>();
                p1.put("name", "Basic CA");
                p1.put("limit", "50 Filings/mo");
                p1.put("price", 999);
                plans.add(p1);
                HashMap<String, Object> p2 = new HashMap<>();
                p2.put("name", "Pro Firm");
                p2.put("limit", "Unlimited Filings");
                p2.put("price", 4999);
                plans.add(p2);
                settings.put("subscriptionPlans", plans);
                return settings;
        }

        @GetMapping("/system-roles")
        public List<Map<String, Object>> getSystemRoles() {
                List<Map<String, Object>> roles = new ArrayList<>();
                HashMap<String, Object> role1 = new HashMap<>();
                role1.put("name", "ADMIN");
                role1.put("canView", true);
                role1.put("canApprove", true);
                role1.put("canFile", true);
                roles.add(role1);
                HashMap<String, Object> role2 = new HashMap<>();
                role2.put("name", "USER");
                role2.put("canView", true);
                role2.put("canApprove", false);
                role2.put("canFile", false);
                roles.add(role2);
                HashMap<String, Object> role3 = new HashMap<>();
                role3.put("name", "AGENT");
                role3.put("canView", true);
                role3.put("canApprove", false);
                role3.put("canFile", false);
                roles.add(role3);
                HashMap<String, Object> role4 = new HashMap<>();
                role4.put("name", "CA");
                role4.put("canView", true);
                role4.put("canApprove", false);
                role4.put("canFile", true);
                roles.add(role4);
                return roles;
        }

        // --- SERVICE REQUEST MANAGEMENT (BINDING & ASSIGNMENT) ---

        @GetMapping("/requests")
        public List<com.shinefiling.common.model.ServiceRequest> getSuperAdminRequests() {
                return serviceRequestRepository.findAll();
        }

        @PutMapping("/requests/{id}/bind")
        public com.shinefiling.common.model.ServiceRequest bindRequestAmount(@PathVariable Long id,
                        @RequestBody Map<String, Object> updates) {
                com.shinefiling.common.model.ServiceRequest req = serviceRequestRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Request not found"));

                if (updates.containsKey("amount")) {
                        req.setBoundAmount(Double.valueOf(updates.get("amount").toString()));
                }

                if (updates.containsKey("caId")) {
                        String caIdStr = updates.get("caId").toString();
                        if (!caIdStr.isEmpty()) {
                                Long caId = Long.valueOf(caIdStr);
                                com.shinefiling.common.model.User ca = userRepository.findById(caId).orElse(null);
                                if (ca != null) {
                                        req.setAssignedCa(ca);
                                        req.setStatus("ASSIGNED"); // Auto-update status
                                        req.setCaApprovalStatus("PENDING_APPROVAL");
                                }
                        }
                }

                if (updates.containsKey("comments")) {
                        req.setAdminComments((String) updates.get("comments"));
                }

                return serviceRequestRepository.save(req);
        }

}
