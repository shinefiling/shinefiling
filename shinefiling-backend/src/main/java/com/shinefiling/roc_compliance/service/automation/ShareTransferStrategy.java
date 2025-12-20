package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ShareTransferStrategy implements IRocStrategy {

    @Override
    public String getServiceType() {
        return "SHARE_TRANSFER_FILING";
    }

    @Override
    public List<String> getRequiredDocuments() {
        return Arrays.asList("SH_4_TRANSFER_DEED", "SHARE_CERTIFICATES", "BOARD_RESOLUTION", "STAMP_DUTY_PROOF");
    }

    @Override
    public void validate(RocApplication app) {
        Map<String, String> up = app.getUploadedDocuments();
        if (up == null)
            throw new RuntimeException("No docs");
        // SH-4 is the main deed
        if (!up.containsKey("SH_4_TRANSFER_DEED"))
            throw new RuntimeException("SH-4 Transfer Deed is required.");
    }

    @Override
    public Map<String, String> generateDrafts(RocApplication app) {
        Map<String, String> m = new HashMap<>();
        String sid = app.getSubmissionId();

        // 1. Board Resolution taking note of transfer
        m.put("BOARD_RESOLUTION_TRANSFER", "/uploads/roc/" + sid + "/internal/BR_Transfer.pdf");

        // 2. Endorsed Share Certificate Template
        m.put("ENDORSED_SHARE_CERTIFICATE_DRAFT", "/uploads/roc/" + sid + "/internal/Cert_Endorsement.pdf");

        return m;
    }
}
