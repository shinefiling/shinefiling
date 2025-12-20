package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.NdaDTO;
import com.shinefiling.legal.model.NdaApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.NdaRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NdaService {

    @Autowired
    private NdaRepository repository;

    @Autowired
    private UserRepository userRepository;

    public NdaApplication createApplication(NdaDTO dto, String email) {
        NdaApplication app = new NdaApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("NDA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setDisclosingParty(dto.getDisclosingParty());
        app.setReceivingParty(dto.getReceivingParty());
        app.setPurpose(dto.getPurpose());
        app.setEffectiveDate(dto.getEffectiveDate());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<NdaApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<NdaApplication> getAllApplications() {
        return repository.findAll();
    }

    public NdaApplication updateStatus(Long id, String status) {
        Optional<NdaApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            NdaApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
