package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.FoundersAgreementDTO;
import com.shinefiling.legal.model.FoundersAgreementApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.FoundersAgreementRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FoundersAgreementService {

    @Autowired
    private FoundersAgreementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public FoundersAgreementApplication createApplication(FoundersAgreementDTO dto, String email) {
        FoundersAgreementApplication app = new FoundersAgreementApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("FA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setCompanyName(dto.getCompanyName());
        app.setFounderNames(dto.getFounderNames());
        app.setBusinessDescription(dto.getBusinessDescription());
        app.setEquitySplit(dto.getEquitySplit());
        app.setVestingSchedule(dto.getVestingSchedule());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<FoundersAgreementApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<FoundersAgreementApplication> getAllApplications() {
        return repository.findAll();
    }

    public FoundersAgreementApplication updateStatus(Long id, String status) {
        Optional<FoundersAgreementApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            FoundersAgreementApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
