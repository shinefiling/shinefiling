package com.shinefiling.common.controller;

import com.shinefiling.common.model.User;
import com.shinefiling.common.model.ClientDetails;
import com.shinefiling.common.model.Payment;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.common.repository.ClientDetailsRepository;
import com.shinefiling.common.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import java.nio.file.*;
import java.net.MalformedURLException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.shinefiling.common.model.ServiceRequest;
import com.shinefiling.licenses.model.FssaiApplication;
import com.shinefiling.business_reg.model.PrivateLimitedApplication;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClientDetailsRepository clientDetailsRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private com.shinefiling.common.service.ServiceRequestService serviceRequestService;

    @Autowired
    private com.shinefiling.licenses.service.FssaiService fssaiService;

    @Autowired
    private com.shinefiling.business_reg.service.PrivateLimitedService pvtLtdService;

    @GetMapping("/{id}/payments")
    public List<Payment> getUserPayments(@PathVariable Long id) {
        return paymentRepository.findByUserId(id);
    }

    @GetMapping("/{id}/stats")
    public Map<String, Object> getUserStats(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            return Map.of("activeServices", 0, "pendingActions", 0, "totalDocuments", 0);

        String email = user.getEmail();

        List<ServiceRequest> generic = serviceRequestService.getKeyRequests(email);
        List<FssaiApplication> fssai = fssaiService.getUserApplications(email);
        List<PrivateLimitedApplication> pvt = pvtLtdService.getApplicationsByUser(email);

        long active = 0;
        long actions = 0;
        long docs = 0;

        // 1. Generic Services
        active += generic.stream().filter(r -> !"COMPLETED".equalsIgnoreCase(r.getStatus())).count();

        // 2. FSSAI Services
        active += fssai.stream().filter(r -> !"COMPLETED".equalsIgnoreCase(r.getStatus())).count();
        actions += fssai.stream().filter(r -> "CORRECTION_REQUIRED".equalsIgnoreCase(r.getStatus())
                || "ACTION_REQUIRED".equalsIgnoreCase(r.getStatus())).count();
        docs += fssai.stream().mapToLong(r -> (r.getUploadedDocuments() != null ? r.getUploadedDocuments().size() : 0)
                + (r.getGeneratedDocuments() != null ? r.getGeneratedDocuments().size() : 0)).sum();

        // 3. Pvt Ltd Services
        active += pvt.stream().filter(r -> !"COMPLETED".equalsIgnoreCase(r.getStatus())).count();
        actions += pvt.stream().filter(r -> "CORRECTION_REQUIRED".equalsIgnoreCase(r.getStatus())).count();
        docs += pvt.stream().mapToLong(r -> (r.getUploadedDocuments() != null ? r.getUploadedDocuments().size() : 0)
                + (r.getGeneratedDocuments() != null ? r.getGeneratedDocuments().size() : 0)).sum();

        return Map.of(
                "activeServices", active,
                "pendingActions", actions,
                "totalDocuments", docs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        // Update User Basic Info
        if (payload.containsKey("fullName"))
            user.setFullName((String) payload.get("fullName"));
        if (payload.containsKey("mobile"))
            user.setMobile((String) payload.get("mobile"));
        if (payload.containsKey("address")) { // Address moved to ClientDetails, but might be sent here
            // Handle in ClientDetails
        }

        userRepository.save(user);

        // Update ClientDetails
        Optional<ClientDetails> detailsOpt = clientDetailsRepository.findByUserId(id);
        ClientDetails details = detailsOpt.orElse(new ClientDetails());
        if (!detailsOpt.isPresent()) {
            details.setUser(user);
        }

        if (payload.containsKey("companyName"))
            details.setCompanyName((String) payload.get("companyName"));
        if (payload.containsKey("gstNumber"))
            details.setGstNumber((String) payload.get("gstNumber"));
        if (payload.containsKey("address"))
            details.setAddress((String) payload.get("address"));

        clientDetailsRepository.save(details);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PostMapping("/{id}/profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
            }

            String uploadDir = System.getProperty("user.home") + "/.shinefiling/uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            String fileName = "PROFILE_" + id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir + fileName);
            Files.write(filePath, file.getBytes());

            String fileUrl = "http://localhost:8080/api/users/uploads/" + fileName;
            user.setProfileImage(fileUrl);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Profile image updated", "profileImage", fileUrl));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    @Autowired
    private com.shinefiling.common.service.EmailService emailService;

    // ... (Existing mappings)

    @PostMapping("/{id}/kyc")
    public ResponseEntity<?> submitKyc(
            @PathVariable Long id,
            @RequestParam("panNumber") String panNumber,
            @RequestParam("aadhaarNumber") String aadhaarNumber,
            @RequestParam(value = "panFile", required = false) MultipartFile panFile,
            @RequestParam(value = "aadhaarFile", required = false) MultipartFile aadhaarFile) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setPanNumber(panNumber);
        user.setAadhaarNumber(aadhaarNumber);

        try {
            // Handle File Uploads
            String uploadDir = System.getProperty("user.home") + "/.shinefiling/uploads/";
            Files.createDirectories(Paths.get(uploadDir));

            Map<String, String> docs = new java.util.HashMap<>();
            if (user.getKycDocuments() != null) {
                try {
                    docs = new ObjectMapper().readValue(user.getKycDocuments(), Map.class);
                } catch (Exception e) {
                }
            }

            if (panFile != null && !panFile.isEmpty()) {
                String fileName = "PAN_" + id + "_" + System.currentTimeMillis() + "_" + panFile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, panFile.getBytes());
                docs.put("pan", "http://localhost:8080/api/users/uploads/" + fileName);
            }

            if (aadhaarFile != null && !aadhaarFile.isEmpty()) {
                String fileName = "AADHAAR_" + id + "_" + System.currentTimeMillis() + "_"
                        + aadhaarFile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, aadhaarFile.getBytes());
                docs.put("aadhaar", "http://localhost:8080/api/users/uploads/" + fileName);
            }

            user.setKycDocuments(new ObjectMapper().writeValueAsString(docs));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message", "File upload failed: " + e.getMessage()));
        }

        user.setKycStatus("SUBMITTED");
        userRepository.save(user);

        // Send Email to Agent
        String refNo = "KYC-" + user.getId() + "-" + System.currentTimeMillis();
        emailService.sendEmail(
                user.getEmail(),
                "KYC Submission Received - ShineFiling",
                "Dear " + user.getFullName() + ",\n\n" +
                        "Your KYC details have been successfully submitted.\n" +
                        "Reference Number: " + refNo + "\n\n" +
                        "Our team will review your documents shortly. You will be notified once your account is activated.\n\n"
                        +
                        "Best Regards,\nShineFiling Team");

        return ResponseEntity.ok(Map.of("message", "KYC submitted successfully", "kycStatus", "SUBMITTED"));
    }

    @PutMapping("/{id}/approve-kyc")
    public ResponseEntity<?> approveAgentKyc(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        user.setKycStatus("VERIFIED");
        user.setStatus("Active");
        userRepository.save(user);

        // Send Approval Email
        emailService.sendEmail(
                user.getEmail(),
                "Account Activated - ShineFiling Partner Program",
                "Dear " + user.getFullName() + ",\n\n" +
                        "Congratulations! Your KYC documents have been verified and your Agent account has been activated.\n\n"
                        +
                        "You can now login and start submitting applications for your clients.\n" +
                        "Login here: http://localhost:5173/login\n\n" +
                        "Best Regards,\nShineFiling Team");

        return ResponseEntity.ok(Map.of("message", "Agent KYC Approved and Account Activated"));
    }

    @PutMapping("/{id}/reject-kyc")
    public ResponseEntity<?> rejectAgentKyc(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        String reason = payload.getOrDefault("reason", "Documents Verification Failed");

        user.setKycStatus("REJECTED");
        userRepository.save(user);

        // Send Rejection Email
        emailService.sendEmail(
                user.getEmail(),
                "KYC Application Requires Action - ShineFiling",
                "Dear " + user.getFullName() + ",\n\n" +
                        "Your Agent KYC application has been reviewed and requires attention.\n\n" +
                        "Reason: " + reason + "\n\n" +
                        "Please login to your dashboard and re-submit your documents with corrections.\n\n" +
                        "Best Regards,\nShineFiling Team");

        return ResponseEntity.ok(Map.of("message", "Agent KYC Rejected"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to delete user: " + e.getMessage()));
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = Paths.get(System.getProperty("user.home") + "/.shinefiling/uploads/").resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
}
