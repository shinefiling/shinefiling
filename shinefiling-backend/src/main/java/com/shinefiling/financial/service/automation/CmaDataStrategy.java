package com.shinefiling.financial.service.automation;

import com.shinefiling.financial.model.FinancialApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class CmaDataStrategy implements IFinancialStrategy {
    @Override
    public String getServiceType() {
        return "CMA_DATA_PREPARATION";
    }

    @Override
    public void validate(FinancialApplication app) {
        if (app.getUploadedDocuments() == null)
            throw new RuntimeException("Docs missing");
    }

    @Override
    public Map<String, String> generateDrafts(FinancialApplication app) {
        return Map.of("CMA_REPORT", "/uploads/fin/CMA.xlsx");
    }
}
