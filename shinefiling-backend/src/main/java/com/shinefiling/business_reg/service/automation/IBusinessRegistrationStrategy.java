package com.shinefiling.business_reg.service.automation;

import com.shinefiling.business_reg.model.BusinessRegistrationApplication;
import java.util.List;
import java.util.Map;

public interface IBusinessRegistrationStrategy {
    String getRegistrationType();

    List<String> getRequiredDocuments();

    void validate(BusinessRegistrationApplication app);

    Map<String, String> generateDrafts(BusinessRegistrationApplication app);
}
