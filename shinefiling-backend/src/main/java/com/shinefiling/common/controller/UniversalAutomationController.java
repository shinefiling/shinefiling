package com.shinefiling.common.controller;

import com.shinefiling.business_reg.service.BusinessRegistrationAutomationService;
import com.shinefiling.tax_compliance.service.TaxComplianceAutomationService;
import com.shinefiling.roc_compliance.service.RocAutomationService;
import com.shinefiling.licenses.service.LicenseAutomationService;
import com.shinefiling.ipr.service.IprAutomationService;
import com.shinefiling.labour_hr.service.LabourAutomationService;
import com.shinefiling.certifications.service.CertificationAutomationService;
import com.shinefiling.legal.service.LegalAutomationService;
import com.shinefiling.financial.service.FinancialAutomationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/automation")
@CrossOrigin(origins = "*")
public class UniversalAutomationController {

    @Autowired
    private BusinessRegistrationAutomationService busService;
    @Autowired
    private TaxComplianceAutomationService taxService;
    @Autowired
    private RocAutomationService rocService;
    @Autowired
    private LicenseAutomationService licService;
    @Autowired
    private IprAutomationService iprService;
    @Autowired
    private LabourAutomationService labourService;
    @Autowired
    private CertificationAutomationService certService;
    @Autowired
    private LegalAutomationService legalService;
    @Autowired
    private FinancialAutomationService finService;

    @PostMapping("/start")
    public ResponseEntity<?> startAutomation(@RequestBody Map<String, String> payload) {
        String sid = payload.get("submissionId");
        String category = payload.get("category"); // e.g., "business_reg"
        String type = payload.get("serviceType"); // e.g., "Private Limited Company Registration"

        if (sid == null || category == null || type == null) {
            return ResponseEntity.badRequest().body("Missing submissionId, category, or serviceType");
        }

        try {
            // Align with ServiceCatalogInitService keys
            switch (category.toLowerCase()) {
                case "business_reg":
                    busService.startAutomation(sid, type);
                    break;
                case "tax_compliance":
                    taxService.start(sid, type);
                    break;
                case "roc_compliance":
                    rocService.startAutomation(sid, type);
                    break;
                case "licenses":
                    licService.start(sid, type);
                    break;
                case "ipr":
                    iprService.start(sid, type);
                    break;
                case "labour_hr":
                    labourService.start(sid, type);
                    break;
                case "certifications":
                    certService.start(sid, type);
                    break;
                case "legal":
                    legalService.start(sid, type);
                    break;
                case "financial":
                    finService.start(sid, type);
                    break;
                default:
                    return ResponseEntity.badRequest().body("Unknown Category: " + category);
            }
            return ResponseEntity
                    .ok(Map.of("message", "Automation Initiated", "submissionId", sid, "status", "PENDING"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
