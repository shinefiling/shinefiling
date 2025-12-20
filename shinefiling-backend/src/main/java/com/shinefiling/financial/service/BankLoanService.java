package com.shinefiling.financial.service;

import com.shinefiling.financial.dto.BankLoanDTO;
import com.shinefiling.financial.model.BankLoanApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.financial.repository.BankLoanRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BankLoanService {

    @Autowired
    private BankLoanRepository repository;

    @Autowired
    private UserRepository userRepository;

    public BankLoanApplication createApplication(BankLoanDTO dto, String email) {
        BankLoanApplication app = new BankLoanApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("BL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setLoanType(dto.getLoanType());
        app.setAmountRequired(dto.getAmountRequired());
        app.setPreferredBank(dto.getPreferredBank());
        app.setCollateralDetails(dto.getCollateralDetails());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<BankLoanApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<BankLoanApplication> getAllApplications() {
        return repository.findAll();
    }

    public BankLoanApplication updateStatus(Long id, String status) {
        Optional<BankLoanApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            BankLoanApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
