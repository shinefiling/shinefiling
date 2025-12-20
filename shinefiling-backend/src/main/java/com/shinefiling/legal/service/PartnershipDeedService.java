package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.PartnershipDeedDTO;
import com.shinefiling.legal.model.PartnershipDeedApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.PartnershipDeedRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PartnershipDeedService {

    @Autowired
    private PartnershipDeedRepository repository;

    @Autowired
    private UserRepository userRepository;

    public PartnershipDeedApplication createApplication(PartnershipDeedDTO dto, String email) {
        PartnershipDeedApplication app = new PartnershipDeedApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("PD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setFirmName(dto.getFirmName());
        app.setBusinessNature(dto.getBusinessNature());
        app.setBusinessAddress(dto.getBusinessAddress());
        app.setPartner1Name(dto.getPartner1Name());
        app.setPartner1Address(dto.getPartner1Address());
        app.setPartner2Name(dto.getPartner2Name());
        app.setPartner2Address(dto.getPartner2Address());
        app.setCapitalContribution(dto.getCapitalContribution());
        app.setProfitSharingRatio(dto.getProfitSharingRatio());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<PartnershipDeedApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<PartnershipDeedApplication> getAllApplications() {
        return repository.findAll();
    }

    public PartnershipDeedApplication getApplicationById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public PartnershipDeedApplication updateStatus(Long id, String status) {
        Optional<PartnershipDeedApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            PartnershipDeedApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
