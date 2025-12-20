package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.FranchiseAgreementDTO;
import com.shinefiling.legal.model.FranchiseAgreementApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.FranchiseAgreementRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FranchiseAgreementService {

    @Autowired
    private FranchiseAgreementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public FranchiseAgreementApplication createApplication(FranchiseAgreementDTO dto, String email) {
        FranchiseAgreementApplication app = new FranchiseAgreementApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("FRA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setFranchisorName(dto.getFranchisorName());
        app.setFranchiseeName(dto.getFranchiseeName());
        app.setFranchiseFee(dto.getFranchiseFee());
        app.setRoyalty(dto.getRoyalty());
        app.setTerritory(dto.getTerritory());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<FranchiseAgreementApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<FranchiseAgreementApplication> getAllApplications() {
        return repository.findAll();
    }

    public FranchiseAgreementApplication updateStatus(Long id, String status) {
        Optional<FranchiseAgreementApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            FranchiseAgreementApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
