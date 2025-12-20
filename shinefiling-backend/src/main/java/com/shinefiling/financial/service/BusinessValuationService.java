package com.shinefiling.financial.service;

import com.shinefiling.financial.dto.BusinessValuationDTO;
import com.shinefiling.financial.model.BusinessValuationApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.financial.repository.BusinessValuationRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BusinessValuationService {

    @Autowired
    private BusinessValuationRepository repository;

    @Autowired
    private UserRepository userRepository;

    public BusinessValuationApplication createApplication(BusinessValuationDTO dto, String email) {
        BusinessValuationApplication app = new BusinessValuationApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("BV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setCompanyName(dto.getCompanyName());
        app.setValuationPurpose(dto.getValuationPurpose());
        app.setAssetsValue(dto.getAssetsValue());
        app.setLastTurnover(dto.getLastTurnover());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<BusinessValuationApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<BusinessValuationApplication> getAllApplications() {
        return repository.findAll();
    }

    public BusinessValuationApplication updateStatus(Long id, String status) {
        Optional<BusinessValuationApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            BusinessValuationApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
