package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.VendorAgreementDTO;
import com.shinefiling.legal.model.VendorAgreementApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.VendorAgreementRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VendorAgreementService {

    @Autowired
    private VendorAgreementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public VendorAgreementApplication createApplication(VendorAgreementDTO dto, String email) {
        VendorAgreementApplication app = new VendorAgreementApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("VA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setVendorName(dto.getVendorName());
        app.setCompanyName(dto.getCompanyName());
        app.setServiceDescription(dto.getServiceDescription());
        app.setPaymentTerms(dto.getPaymentTerms());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<VendorAgreementApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<VendorAgreementApplication> getAllApplications() {
        return repository.findAll();
    }

    public VendorAgreementApplication updateStatus(Long id, String status) {
        Optional<VendorAgreementApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            VendorAgreementApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
