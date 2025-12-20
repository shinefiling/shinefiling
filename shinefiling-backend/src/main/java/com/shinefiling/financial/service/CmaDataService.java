package com.shinefiling.financial.service;

import com.shinefiling.financial.dto.CmaDataDTO;
import com.shinefiling.financial.model.CmaDataApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.financial.repository.CmaDataRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CmaDataService {

    @Autowired
    private CmaDataRepository repository;

    @Autowired
    private UserRepository userRepository;

    public CmaDataApplication createApplication(CmaDataDTO dto, String email) {
        CmaDataApplication app = new CmaDataApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("CMA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setBusinessName(dto.getBusinessName());
        app.setLoanAmount(dto.getLoanAmount());
        app.setBankName(dto.getBankName());
        app.setTurnover(dto.getTurnover());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<CmaDataApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<CmaDataApplication> getAllApplications() {
        return repository.findAll();
    }

    public CmaDataApplication updateStatus(Long id, String status) {
        Optional<CmaDataApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            CmaDataApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
