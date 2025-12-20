package com.shinefiling.labour_hr.service.automation;

import com.shinefiling.labour_hr.model.LabourApplication;
import java.util.List;
import java.util.Map;

public interface ILabourStrategy {
    String getServiceType();

    List<String> getRequiredDocuments();

    void validate(LabourApplication app);

    Map<String, String> generateDrafts(LabourApplication app);
}
