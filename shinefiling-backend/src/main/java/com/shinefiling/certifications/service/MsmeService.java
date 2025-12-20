package com.shinefiling.certifications.service;

import com.shinefiling.certifications.dto.MsmeApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.MsmeApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.repository.MsmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class MsmeService {

    @Autowired
    private MsmeRepository msmeRepository;

    @Autowired
    private UserRepository userRepository;

    public MsmeApplication createApplication(MsmeApplicationDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        MsmeApplication app = new MsmeApplication();
        app.setUser(user);
        app.setSubmissionId("MSME-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        // Map DTO to Entity
        app.setApplicantName(dto.getApplicantName());
        app.setAadhaarNumber(dto.getAadhaarNumber());
        app.setPanNumber(dto.getPanNumber());
        app.setEnterpriseName(dto.getEnterpriseName());
        app.setOrganisationType(dto.getOrganisationType());
        app.setPlantAddress(dto.getPlantAddress());
        app.setOfficialAddress(dto.getOfficialAddress());
        app.setBankAccountNumber(dto.getBankAccountNumber());
        app.setIfscCode(dto.getIfscCode());
        app.setMobileNumber(dto.getMobileNumber());
        app.setEmail(dto.getEmail());
        app.setDateOfCommencement(dto.getDateOfCommencement());
        app.setMajorActivity(dto.getMajorActivity());
        app.setNicCodes(dto.getNicCodes());
        app.setMaleEmployees(dto.getMaleEmployees());
        app.setFemaleEmployees(dto.getFemaleEmployees());
        app.setOtherEmployees(dto.getOtherEmployees());
        app.setInvestmentPlantMachinery(dto.getInvestmentPlantMachinery());
        app.setTurnover(dto.getTurnover());

        return msmeRepository.save(app);
    }

    public MsmeApplication getApplication(String submissionId) {
        return msmeRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public MsmeApplication updateStatus(String submissionId, String status) {
        MsmeApplication app = getApplication(submissionId);
        app.setStatus(status);
        return msmeRepository.save(app);
    }

    public List<MsmeApplication> getAllApplications() {
        return msmeRepository.findAll();
    }

    public List<MsmeApplication> getUserApplications(Long userId) {
        return msmeRepository.findByUserId(userId);
    }
}
