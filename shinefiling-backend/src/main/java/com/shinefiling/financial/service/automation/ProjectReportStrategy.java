package com.shinefiling.financial.service.automation;

import com.shinefiling.financial.model.FinancialApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class ProjectReportStrategy implements IFinancialStrategy {
    @Override
    public String getServiceType() {
        return "PROJECT_REPORT_FOR_LOANS";
    }

    @Override
    public void validate(FinancialApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(FinancialApplication app) {
        return new HashMap<>();
    }
}
