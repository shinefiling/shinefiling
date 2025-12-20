package com.shinefiling.financial.service.automation;

import com.shinefiling.financial.model.FinancialApplication;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class PitchDeckStrategy implements IFinancialStrategy {
    @Override
    public String getServiceType() {
        return "STARTUP_PITCH_DECK";
    }

    @Override
    public void validate(FinancialApplication app) {
    }

    @Override
    public Map<String, String> generateDrafts(FinancialApplication app) {
        return new HashMap<>();
    }
}
