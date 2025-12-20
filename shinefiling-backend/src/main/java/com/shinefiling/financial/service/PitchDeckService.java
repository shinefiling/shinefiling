package com.shinefiling.financial.service;

import com.shinefiling.financial.dto.PitchDeckDTO;
import com.shinefiling.financial.model.PitchDeckApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.financial.repository.PitchDeckRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PitchDeckService {

    @Autowired
    private PitchDeckRepository repository;

    @Autowired
    private UserRepository userRepository;

    public PitchDeckApplication createApplication(PitchDeckDTO dto, String email) {
        PitchDeckApplication app = new PitchDeckApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("PD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setStartupName(dto.getStartupName());
        app.setIndustry(dto.getIndustry());
        app.setFundingStage(dto.getFundingStage());
        app.setTargetAudience(dto.getTargetAudience());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<PitchDeckApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<PitchDeckApplication> getAllApplications() {
        return repository.findAll();
    }

    public PitchDeckApplication updateStatus(Long id, String status) {
        Optional<PitchDeckApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            PitchDeckApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
