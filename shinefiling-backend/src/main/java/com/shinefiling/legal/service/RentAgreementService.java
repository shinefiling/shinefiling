package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.RentAgreementDTO;
import com.shinefiling.legal.model.RentAgreementApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.RentAgreementRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RentAgreementService {

    @Autowired
    private RentAgreementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public RentAgreementApplication createApplication(RentAgreementDTO dto, String email) {
        RentAgreementApplication app = new RentAgreementApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("RA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setLandlordName(dto.getLandlordName());
        app.setTenantName(dto.getTenantName());
        app.setPropertyAddress(dto.getPropertyAddress());
        app.setRentAmount(dto.getRentAmount());
        app.setSecurityDeposit(dto.getSecurityDeposit());
        app.setLeaseDuration(dto.getLeaseDuration());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<RentAgreementApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<RentAgreementApplication> getAllApplications() {
        return repository.findAll();
    }

    public RentAgreementApplication updateStatus(Long id, String status) {
        Optional<RentAgreementApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            RentAgreementApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
