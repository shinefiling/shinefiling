package com.shinefiling.common.service;

import com.shinefiling.common.model.ServiceCatalog;
import com.shinefiling.common.repository.ServiceCatalogRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;

@Service
public class ServiceCatalogInitService {

    @Autowired
    private ServiceCatalogRepository repo;

    @PostConstruct
    public void init() {
        if (repo.count() > 0)
            return; // Already initialized

        add("business_reg", "Business Registration", "#6366f1", Arrays.asList(
                "Private Limited Company Registration", "One Person Company (OPC)",
                "Limited Liability Partnership (LLP)", "Partnership Firm Registration",
                "Sole Proprietorship Registration", "Section 8 NGO Company",
                "Nidhi Company Registration", "Producer Company Registration",
                "Public Limited Company"));

        add("tax_compliance", "Tax & Compliance", "#10b981", Arrays.asList(
                "GST Registration", "GST Monthly Return (GSTR-1 & 3B)", "GST Annual Return (GSTR-9)",
                "Income Tax Return (ITR 1–7)", "TDS Return Filing", "Professional Tax Reg & Filing",
                "Advance Tax Filing", "Tax Audit Filing"));

        add("roc_compliance", "ROC / MCA Filings", "#3b82f6", Arrays.asList(
                "Annual ROC Filing (AOC-4, MGT-7)", "Director KYC (DIR-3 KYC)", "Add/Remove Director",
                "Change of Registered Office", "Share Transfer Filing", "Increase Authorized Capital",
                "MOA/AOA Amendment", "Company Name Change", "Strike Off Company"));

        add("licenses", "Government Licenses", "#f97316", Arrays.asList(
                "FSSAI License (Basic/State/Central)", "Shop & Establishment License", "Trade License",
                "Labour License", "Factory License", "Drug License", "Fire Safety NOC",
                "Pollution Control (CTE/CTO)", "Import Export Code (IEC)", "Gumastha License",
                "Bar / Liquor License"));

        add("ipr", "Intellectual Property", "#8b5cf6", Arrays.asList(
                "Trademark Registration", "Trademark Objection Reply", "Trademark Hearing Support",
                "Trademark Assignment", "Trademark Renewal", "Copyright Registration",
                "Patent Filing (Provisional/Complete)", "Design Registration"));

        add("labour_hr", "Labour Law & HR", "#06b6d4", Arrays.asList(
                "PF Registration & Filing", "ESI Registration & Filing",
                "Professional Tax Reg & Filing", "Labour Welfare Fund Filing", "Gratuity Act Registration",
                "Bonus Act Compliance", "Minimum Wages Compliance"));

        add("certifications", "Business Certifications", "#f59e0b", Arrays.asList(
                "MSME / Udyam Registration", "ISO Certification (9001, 14001)",
                "Startup India Recognition", "Digital Signature (DSC)", "Bar Code Registration",
                "TAN / PAN Application"));

        add("legal", "Legal Drafting", "#f43f5e", Arrays.asList(
                "Partnership Deed", "Founders Agreement", "Shareholders Agreement", "Employment Agreement",
                "Rent Agreement", "Franchise Agreement", "NDA (Non-Disclosure)", "Vendor Agreement"));

        add("financial", "Financial Services", "#14b8a6", Arrays.asList(
                "CMA Data Preparation", "Project Report for Loans", "Bank Loan Documentation",
                "Cash Flow Compliance", "Startup Pitch Deck", "Business Valuation Reports"));
    }

    private void add(String cat, String title, String color, java.util.List<String> services) {
        repo.save(new ServiceCatalog(cat, title, color, services));
    }
}
