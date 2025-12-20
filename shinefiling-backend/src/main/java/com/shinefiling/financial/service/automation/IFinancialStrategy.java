package com.shinefiling.financial.service.automation;

import com.shinefiling.financial.model.FinancialApplication;
import java.util.*;

public interface IFinancialStrategy {
    String getServiceType();

    void validate(FinancialApplication app);

    Map<String, String> generateDrafts(FinancialApplication app);
}
