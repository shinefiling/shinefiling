package com.shinefiling.common.service.automation;

import com.shinefiling.business_reg.model.PrivateLimitedApplication;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class DocumentGenerationService {

    // @Autowired
    // private AICoreService aiService; // Removed for Non-AI Implementation

    private final Path storageLocation;

    public DocumentGenerationService() {
        this.storageLocation = Paths.get("uploads", "generated").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory for generated files.", ex);
        }
    }

    public Map<String, String> generateAllDocuments(PrivateLimitedApplication app) {
        Map<String, String> generatedPaths = new HashMap<>();

        try {
            // 1. MOA
            generatedPaths.put("MOA", generateDoc(app, "MOA"));

            // 2. AOA
            generatedPaths.put("AOA", generateDoc(app, "AOA"));

            // 3. Name Approval
            generatedPaths.put("NAME_APPROVAL", generateDoc(app, "Name_Approval_Application"));

            // 4. Plan Specific
            if (!"BASIC".equalsIgnoreCase(app.getPlanType())) {
                generatedPaths.put("SHARE_CERTIFICATES", generateDoc(app, "Share_Certificates_Template"));
            }
            if ("PREMIUM".equalsIgnoreCase(app.getPlanType())) {
                generatedPaths.put("GST_FORM", generateDoc(app, "GST_Registration_Form"));
                generatedPaths.put("BOARD_RESOLUTION", generateDoc(app, "Board_Resolution_v1"));
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Document Generation Failed: " + e.getMessage());
        }

        return generatedPaths;
    }

    private String generateDoc(PrivateLimitedApplication app, String type) throws Exception {
        String companyName = (app.getProposedNames() != null && !app.getProposedNames().isEmpty())
                ? app.getProposedNames().get(0).toUpperCase()
                : "PROPOSED COMPANY";
        String state = extractState(app.getRegisteredAddress()); // You'll need to add extractState method too
        String date = java.time.LocalDate.now().toString();

        String body = "";
        switch (type) {
            case "MOA":
                body = generateMOATemplate(companyName, state, app.getAuthorizedCapital());
                break;
            case "AOA":
                body = generateAOATemplate(companyName);
                break;
            case "Board_Resolution_v1":
                body = generateBoardResolutionTemplate(companyName, app.getDirectors(), app.getRegisteredAddress()); // Renamed
                                                                                                                     // to
                                                                                                                     // avoid
                                                                                                                     // confusion
                break;
            case "Name_Approval_Application":
                body = generateNameApplicationTemplate(app); // Renamed
                break;
            case "Share_Certificates_Template":
                body = generateShareCertificateTemplate(companyName, app.getDirectors());
                break;
            case "GST_Registration_Form":
                body = "<h3>GST Registration Form</h3><p>Auto-filled for " + companyName + "</p>";
                break;
            default:
                body = "<h3>" + type.replace("_", " ")
                        + "</h3><p>This document has been automatically generated based on the application rules.</p>" +
                        "<p><b>Applicant:</b> " + companyName + "</p>" +
                        "<p><b>Date:</b> " + date + "</p>";
        }

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Times New Roman', serif; margin: 40px; background: #f5f5f5; }
                        .page { background: white; padding: 60px; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 4px; min-height: 1000px; }
                        .watermark { opacity: 0.1; position: fixed; top: 50%%; left: 50%%; transform: translate(-50%%, -50%%) rotate(-45deg); font-size: 80px; font-weight: bold; color: gray; z-index:-1; pointer-events: none; }
                        .footer { margin-top: 50px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
                        .header { text-align: center; margin-bottom: 40px; }
                        h1, h2, h3 { color: #333; }
                    </style>
                </head>
                <body>
                    <div class="watermark">DRAFT</div>
                    <div class="page">
                        %s
                        <div class="footer">
                            Generated securely by ShineFiling Automation Engine • %s • Ref: %s
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(body, java.time.LocalDateTime.now(), app.getSubmissionId());

        String filename = app.getSubmissionId() + "_" + type + ".html";
        Path targetPath = this.storageLocation.resolve(filename);
        Files.write(targetPath, htmlContent.getBytes());

        return "/api/upload/generated/" + filename;
    }

    // --- TEMPLATES (Migrated from legacy service) ---

    private String generateMOATemplate(String name, String state, String capital) {
        return """
                <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
                    <h2 style="text-align: center; text-transform: uppercase;">MEMORANDUM OF ASSOCIATION</h2>
                    <h3 style="text-align: center;">OF</h3>
                    <h1 style="text-align: center; text-transform: uppercase;">%s</h1>
                    <p style="text-align: center;">(A Company Limited by Shares)</p>

                    <ol>
                        <li>The Name of the Company is <b>%s</b>.</li>
                        <li>The Registered Office of the Company will be situated in the State of <b>%s</b>.</li>
                        <li>The Objects to be pursued by the company on its incorporation are:
                            <ul style="list-style-type: none;">
                                <li>(A) To carry on in India or elsewhere the business of Software Development, IT Consulting, System Analysis, Data Processing, and providing internet-based services.</li>
                                <li>(B) To develop, export, import, trade, and deal in computer software and hardware.</li>
                            </ul>
                        </li>
                        <li>The Liability of the members is Limited.</li>
                        <li>The Authorized Share Capital of the Company is <b>Rs. %s</b> divided into Equity Shares of Rs. 10 each.</li>
                    </ol>

                    <p>We, the several persons whose names and addresses are subscribed, are desirous of being formed into a company in pursuance of this Memorandum of Association.</p>
                </div>
                """
                .formatted(name, name, state, capital != null ? capital : "100000");
    }

    private String generateAOATemplate(String name) {
        return """
                <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
                    <h2 style="text-align: center; text-transform: uppercase;">ARTICLES OF ASSOCIATION</h2>
                    <h3 style="text-align: center;">OF</h3>
                    <h1 style="text-align: center; text-transform: uppercase;">%s</h1>

                    <h3>Preliminary</h3>
                    <p>1. The Regulations contained in Table F of Schedule I to the Companies Act, 2013 shall apply to this Company, except insofar as they are hereinafter expressly excluded or modified.</p>

                    <h3>Share Capital</h3>
                    <p>2. The Share Capital of the Company shall be as per Clause V of the Memorandum of Association.</p>
                    <p>3. The Company shall have power to increase, reduce or alter its share capital in accordance with the provisions of the Act.</p>

                    <h3>Board of Directors</h3>
                    <p>4. The First Directors of the Company shall be as named in the incorporation documents.</p>
                    <p>5. The minimal number of directors shall be two and maximum fifteen.</p>
                </div>
                """
                .formatted(name);
    }

    private String generateBoardResolutionTemplate(String name,
            java.util.List<com.shinefiling.business_reg.model.PvtLtdDirector> directors, String address) {
        StringBuilder directorNames = new StringBuilder();
        if (directors != null) {
            for (com.shinefiling.business_reg.model.PvtLtdDirector d : directors) {
                directorNames.append("<li>").append(d.getName()).append("</li>");
            }
        }

        return """
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                     <h2 style="text-align: center;">CERTIFIED TRUE COPY OF THE RESOLUTION PASSED AT THE FIRST BOARD MEETING</h2>
                     <p><b>HELD AT:</b> %s</p>
                     <p><b>DATE:</b> %s</p>

                     <h3>OPENING OF BANK ACCOUNT</h3>
                     <p>"RESOLVED THAT a Current Account be opened in the name of <b>%s</b> with [Bank Name] at [Branch] and that the said Bank be instructed to honor all cheques, bills, notes, and other instruments signed by any of the following Directors:"</p>

                     <ul>%s</ul>

                     <p>"RESOLVED FURTHER THAT the above authorized signatories are hereby authorized to do all such acts, deeds, and things as may be necessary to give effect to this resolution."</p>

                     <br/><br/>
                     <p><b>For %s</b></p>
                     <br/>
                     <p>Director (Signature)</p>
                </div>
                """
                .formatted(address != null ? address : "Registered Office", java.time.LocalDate.now(), name,
                        directorNames.toString(), name);
    }

    private String generateNameApplicationTemplate(PrivateLimitedApplication app) {
        String name1 = (app.getProposedNames() != null && app.getProposedNames().size() > 0)
                ? app.getProposedNames().get(0)
                : "";
        String name2 = (app.getProposedNames() != null && app.getProposedNames().size() > 1)
                ? app.getProposedNames().get(1)
                : "";

        return """
                <div style="font-family: Arial, sans-serif;">
                    <h2 style="text-align: center;">APPLICATION FOR RESERVATION OF NAME (RUN)</h2>
                    <table border="1" cellpadding="10" cellspacing="0" width="100%%">
                        <tr>
                            <td><b>Entity Type</b></td>
                            <td>Private Limited Company</td>
                        </tr>
                        <tr>
                            <td><b>Proposed Name 1</b></td>
                            <td>%s</td>
                        </tr>
                         <tr>
                            <td><b>Proposed Name 2</b></td>
                            <td>%s</td>
                        </tr>
                        <tr>
                            <td><b>Objects</b></td>
                            <td>%s</td>
                        </tr>
                    </table>
                    <p><i>This is a system-generated preview of the filing to be made on MCA V3 Portal.</i></p>
                </div>
                """.formatted(name1, name2,
                app.getBusinessActivity() != null ? app.getBusinessActivity() : "IT and Software Services");
    }

    private String generateShareCertificateTemplate(String companyName,
            java.util.List<com.shinefiling.business_reg.model.PvtLtdDirector> directors) {
        return """
                <div style="border: 10px double #4a4a4a; padding: 40px; height: 600px; text-align: center; position: relative;">
                    <h1 style="font-family: serif; font-size: 40px; margin-bottom: 10px;">SHARE CERTIFICATE</h1>
                    <h2 style="text-transform: uppercase;">%s</h2>
                    <p>Incorporated under the Companies Act, 2013</p>

                    <p style="margin-top: 50px; font-size: 18px;">
                        This is to certify that <b>[SHAREHOLDER NAME]</b> is the Registered Holder of <b>[NO. OF SHARES]</b> Equity Shares
                        of Rupees Ten each fully paid up in the above named Company.
                    </p>

                    <div style="position: absolute; bottom: 60px; width: 100%%; left: 0;">
                        <table width="100%%">
                            <tr>
                                <td align="center">______________________<br/>Director</td>
                                <td align="center">______________________<br/>Director</td>
                                <td align="center">______________________<br/>Auth. Signatory</td>
                            </tr>
                        </table>
                    </div>
                </div>
                """
                .formatted(companyName);
    }

    private String extractState(String address) {
        if (address == null)
            return "India";
        String lower = address.toLowerCase();
        if (lower.contains("delhi"))
            return "Delhi";
        if (lower.contains("mumbai") || lower.contains("maharashtra") || lower.contains("pune"))
            return "Maharashtra";
        if (lower.contains("bangalore") || lower.contains("bengaluru") || lower.contains("karnataka"))
            return "Karnataka";
        if (lower.contains("chennai") || lower.contains("tamil nadu"))
            return "Tamil Nadu";
        if (lower.contains("hyderabad") || lower.contains("telangana"))
            return "Telangana";
        return "India";
    }
}
