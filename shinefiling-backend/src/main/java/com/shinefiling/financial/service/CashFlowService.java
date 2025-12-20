package com.shinefiling.financial.service;

import com.shinefiling.financial.dto.CashFlowDTO;
import com.shinefiling.financial.model.CashFlowApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.financial.repository.CashFlowRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CashFlowService {

    @Autowired
    private CashFlowRepository repository;

    @Autowired
    private UserRepository userRepository;

    public CashFlowApplication createApplication(CashFlowDTO dto, String email) {
        CashFlowApplication app = new CashFlowApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("CF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setBusinessName(dto.getBusinessName());
        app.setReportingPeriod(dto.getReportingPeriod());
        app.setTransactionVolume(dto.getTransactionVolume());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<CashFlowApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<CashFlowApplication> getAllApplications() {
        return repository.findAll();
    }

    public CashFlowApplication updateStatus(Long id, String status) {
        Optional<CashFlowApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            CashFlowApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
