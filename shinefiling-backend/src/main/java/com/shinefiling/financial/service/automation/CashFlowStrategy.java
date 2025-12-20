package com.shinefiling.financial.service.automation;

import com.shinefiling.financial.model.FinancialApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class CashFlowStrategy implements IFinancialStrategy {
    @Override
    public String getServiceType() {
        return "CASH_FLOW_COMPLIANCE";
    }

    @Override
    public void validate(FinancialApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(FinancialApplication app) {
        return new HashMap<>();
    }
}
