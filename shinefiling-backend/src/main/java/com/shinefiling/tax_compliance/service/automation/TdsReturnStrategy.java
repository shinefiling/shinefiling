package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class TdsReturnStrategy implements ITaxComplianceStrategy {

    @Override
    public String getServiceType() {
        return "TDS_RETURN_FILING";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList(
                "TAN_REGISTRATION_CERTIFICATE",
                "TDS_CHALLAN_RECEIPTS_281",
                "DEDUCTEE_DETAILS_EXCEL_PAN_DATA",
                "TRACES_LOGIN_CREDENTIALS");
    }

    @Override
    public void validate(TaxComplianceApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null || up.isEmpty())
            throw new RuntimeException("No Docs");

        if (!up.containsKey("DEDUCTEE_DETAILS_EXCEL_PAN_DATA")) {
            throw new RuntimeException("Deductee Details (PAN & Tax Amount) are missing.");
        }
        if (!up.containsKey("TDS_CHALLAN_RECEIPTS_281")) {
            throw new RuntimeException("Challan Receipts (Proof of Payment) are missing.");
        }
    }

    @Override
    public Map<String, String> generateDrafts(TaxComplianceApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Form 27A (Physical summary form signed by deductor)
        m.put("FORM_27A_DRAFT", "/uploads/tax/" + sid + "/drafts/Form27A.pdf");

        // 2. FVU File (File Validation Utility output for upload)
        m.put("FVU_FILE_READY_FOR_UPLOAD", "/uploads/tax/" + sid + "/fvu/Return.fvu");

        // 3. CSI File (Challan Status Inquiry) - downloaded
        m.put("CSI_FILE_VERIFIED", "/uploads/tax/" + sid + "/internal/ChallanStatus.csi");

        return m;
    }
}
