package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.ShareholdersAgreementDTO;
import com.shinefiling.legal.model.ShareholdersAgreementApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.ShareholdersAgreementRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ShareholdersAgreementService {

    @Autowired
    private ShareholdersAgreementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public ShareholdersAgreementApplication createApplication(ShareholdersAgreementDTO dto, String email) {
        ShareholdersAgreementApplication app = new ShareholdersAgreementApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("SA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setCompanyName(dto.getCompanyName());
        app.setShareholderNames(dto.getShareholderNames());
        app.setShareCapitalDetails(dto.getShareCapitalDetails());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<ShareholdersAgreementApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<ShareholdersAgreementApplication> getAllApplications() {
        return repository.findAll();
    }

    public ShareholdersAgreementApplication updateStatus(Long id, String status) {
        Optional<ShareholdersAgreementApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            ShareholdersAgreementApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
