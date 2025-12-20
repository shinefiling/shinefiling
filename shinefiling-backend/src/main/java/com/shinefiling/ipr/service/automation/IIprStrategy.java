package com.shinefiling.ipr.service.automation;

import com.shinefiling.ipr.model.IprApplication;
import java.util.List;
import java.util.Map;

public interface IIprStrategy {
    String getServiceType();

    List<String> getRequiredDocuments();

    void validate(IprApplication app);

    Map<String, String> generateDrafts(IprApplication app);
}
