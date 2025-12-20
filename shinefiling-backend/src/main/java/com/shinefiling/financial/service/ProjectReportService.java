package com.shinefiling.financial.service;

import com.shinefiling.financial.dto.ProjectReportDTO;
import com.shinefiling.financial.model.ProjectReportApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.financial.repository.ProjectReportRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectReportService {

    @Autowired
    private ProjectReportRepository repository;

    @Autowired
    private UserRepository userRepository;

    public ProjectReportApplication createApplication(ProjectReportDTO dto, String email) {
        ProjectReportApplication app = new ProjectReportApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("DPR-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setProjectTitle(dto.getProjectTitle());
        app.setBusinessSector(dto.getBusinessSector());
        app.setEstimatedCost(dto.getEstimatedCost());
        app.setPurpose(dto.getPurpose());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<ProjectReportApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<ProjectReportApplication> getAllApplications() {
        return repository.findAll();
    }

    public ProjectReportApplication updateStatus(Long id, String status) {
        Optional<ProjectReportApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            ProjectReportApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
