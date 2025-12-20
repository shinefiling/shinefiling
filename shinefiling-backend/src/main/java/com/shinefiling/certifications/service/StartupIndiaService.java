package com.shinefiling.certifications.service;

import com.shinefiling.certifications.dto.StartupIndiaDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.StartupIndiaApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.repository.StartupIndiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class StartupIndiaService {
    @Autowired
    private StartupIndiaRepository startupRepository;
    @Autowired
    private UserRepository userRepository;

    public StartupIndiaApplication createApplication(StartupIndiaDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        StartupIndiaApplication app = new StartupIndiaApplication();
        app.setUser(user);
        app.setSubmissionId("STARTUP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setStartupName(dto.getStartupName());
        app.setEntityType(dto.getEntityType());
        app.setDateOfIncorporation(dto.getDateOfIncorporation());
        app.setIncorporationNumber(dto.getIncorporationNumber());
        app.setIndustry(dto.getIndustry());
        app.setSector(dto.getSector());
        app.setMobile(dto.getMobile());
        app.setEmail(dto.getEmail());

        return startupRepository.save(app);
    }

    public List<StartupIndiaApplication> getUserApplications(Long userId) {
        return startupRepository.findByUserId(userId);
    }

    public List<StartupIndiaApplication> getAllApplications() {
        return startupRepository.findAll();
    }

    public StartupIndiaApplication getApplication(Long id) {
        return startupRepository.findById(id).orElse(null);
    }

    public StartupIndiaApplication updateStatus(Long id, String status) {
        StartupIndiaApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            return startupRepository.save(app);
        }
        return null;
    }
}
