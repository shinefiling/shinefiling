package com.shinefiling.certifications.service;

import com.shinefiling.certifications.dto.IsoApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.IsoApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.repository.IsoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class IsoService {
    @Autowired
    private IsoRepository isoRepository;
    @Autowired
    private UserRepository userRepository;

    public IsoApplication createApplication(IsoApplicationDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        IsoApplication app = new IsoApplication();
        app.setUser(user);
        app.setSubmissionId("ISO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setBusinessName(dto.getBusinessName());
        app.setBusinessType(dto.getBusinessType());
        app.setIsoStandard(dto.getIsoStandard());
        app.setScopeOfBusiness(dto.getScopeOfBusiness());
        app.setCurrentCertification(dto.getCurrentCertification());
        app.setMobile(dto.getMobile());
        app.setEmail(dto.getEmail());
        app.setAddress(dto.getAddress());

        return isoRepository.save(app);
    }

    public List<IsoApplication> getUserApplications(Long userId) {
        return isoRepository.findByUserId(userId);
    }

    public List<IsoApplication> getAllApplications() {
        return isoRepository.findAll();
    }

    public IsoApplication getApplication(Long id) {
        return isoRepository.findById(id).orElse(null);
    }

    public IsoApplication updateStatus(Long id, String status) {
        IsoApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            return isoRepository.save(app);
        }
        return null;
    }
}
