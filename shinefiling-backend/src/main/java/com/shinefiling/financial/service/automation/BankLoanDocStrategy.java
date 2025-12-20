package com.shinefiling.financial.service.automation;

import com.shinefiling.financial.model.FinancialApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class BankLoanDocStrategy implements IFinancialStrategy {
    @Override
    public String getServiceType() {
        return "BANK_LOAN_DOCUMENTATION";
    }

    @Override
    public void validate(FinancialApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(FinancialApplication app) {
        return new HashMap<>();
    }
}
