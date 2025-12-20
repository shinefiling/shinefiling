package com.shinefiling.roc_compliance.service.automation;

import com.shinefiling.roc_compliance.model.RocApplication;
import java.util.List;
import java.util.Map;

public interface IRocStrategy {
    String getServiceType();

    List<String> getRequiredDocuments();

    void validate(RocApplication app);

    Map<String, String> generateDrafts(RocApplication app);
}
