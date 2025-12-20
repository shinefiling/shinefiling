package com.shinefiling.tax_compliance.service.automation;

import com.shinefiling.tax_compliance.model.TaxComplianceApplication;
import java.util.List;
import java.util.Map;

public interface ITaxComplianceStrategy {
    String getServiceType();

    List<String> getRequiredDocuments();

    void validate(TaxComplianceApplication app);

    Map<String, String> generateDrafts(TaxComplianceApplication app);
}
