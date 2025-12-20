package com.shinefiling.certifications.service;

import com.shinefiling.certifications.dto.TanPanApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.TanPanApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.repository.TanPanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TanPanService {
    @Autowired
    private TanPanRepository tanPanRepository;
    @Autowired
    private UserRepository userRepository;

    public TanPanApplication createApplication(TanPanApplicationDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        TanPanApplication app = new TanPanApplication();
        app.setUser(user);
        app.setSubmissionId("TANPAN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setApplicationType(dto.getApplicationType());
        app.setApplicantCategory(dto.getApplicantCategory());
        app.setApplicantName(dto.getApplicantName());
        app.setFatherName(dto.getFatherName());
        app.setDobIncorporation(dto.getDobIncorporation());
        app.setMobile(dto.getMobile());
        app.setEmail(dto.getEmail());
        app.setAadhaarNumber(dto.getAadhaarNumber());
        app.setPanNumber(dto.getPanNumber());
        app.setAddress(dto.getAddress());

        return tanPanRepository.save(app);
    }

    public List<TanPanApplication> getUserApplications(Long userId) {
        return tanPanRepository.findByUserId(userId);
    }

    public List<TanPanApplication> getAllApplications() {
        return tanPanRepository.findAll();
    }

    public TanPanApplication getApplication(Long id) {
        return tanPanRepository.findById(id).orElse(null);
    }

    public TanPanApplication updateStatus(Long id, String status) {
        TanPanApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            return tanPanRepository.save(app);
        }
        return null;
    }
}
