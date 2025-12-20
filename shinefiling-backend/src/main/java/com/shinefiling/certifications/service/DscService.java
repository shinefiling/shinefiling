package com.shinefiling.certifications.service;

import com.shinefiling.certifications.dto.DscApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.DscApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.repository.DscRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DscService {
    @Autowired
    private DscRepository dscRepository;
    @Autowired
    private UserRepository userRepository;

    public DscApplication createApplication(DscApplicationDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        DscApplication app = new DscApplication();
        app.setUser(user);
        app.setSubmissionId("DSC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setApplicantName(dto.getApplicantName());
        app.setApplicantType(dto.getApplicantType());
        app.setClassType(dto.getClassType());
        app.setValidityYears(dto.getValidityYears());
        app.setTokenRequired(dto.getTokenRequired());
        app.setMobile(dto.getMobile());
        app.setEmail(dto.getEmail());
        app.setPanNumber(dto.getPanNumber());
        app.setAadhaarNumber(dto.getAadhaarNumber());
        app.setGstNumber(dto.getGstNumber());

        return dscRepository.save(app);
    }

    public List<DscApplication> getUserApplications(Long userId) {
        return dscRepository.findByUserId(userId);
    }

    public List<DscApplication> getAllApplications() {
        return dscRepository.findAll();
    }

    public DscApplication getApplication(Long id) {
        return dscRepository.findById(id).orElse(null);
    }

    public DscApplication updateStatus(Long id, String status) {
        DscApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            return dscRepository.save(app);
        }
        return null;
    }
}
