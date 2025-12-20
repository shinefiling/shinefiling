package com.shinefiling.legal.service;

import com.shinefiling.legal.dto.EmploymentAgreementDTO;
import com.shinefiling.legal.model.EmploymentAgreementApplication;
import com.shinefiling.common.model.User;
import com.shinefiling.legal.repository.EmploymentAgreementRepository;
import com.shinefiling.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmploymentAgreementService {

    @Autowired
    private EmploymentAgreementRepository repository;

    @Autowired
    private UserRepository userRepository;

    public EmploymentAgreementApplication createApplication(EmploymentAgreementDTO dto, String email) {
        EmploymentAgreementApplication app = new EmploymentAgreementApplication();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            app.setUser(userOpt.get());
        }

        app.setSubmissionId("EA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setEmployerName(dto.getEmployerName());
        app.setEmployeeName(dto.getEmployeeName());
        app.setDesignation(dto.getDesignation());
        app.setSalary(dto.getSalary());
        app.setJoiningDate(dto.getJoiningDate());
        app.setProbationPeriod(dto.getProbationPeriod());

        app.setMobile(dto.getMobile());
        app.setEmail(email);

        return repository.save(app);
    }

    public List<EmploymentAgreementApplication> getApplicationsByUser(String email) {
        return repository.findByUserEmail(email);
    }

    public List<EmploymentAgreementApplication> getAllApplications() {
        return repository.findAll();
    }

    public EmploymentAgreementApplication updateStatus(Long id, String status) {
        Optional<EmploymentAgreementApplication> appOpt = repository.findById(id);
        if (appOpt.isPresent()) {
            EmploymentAgreementApplication app = appOpt.get();
            app.setStatus(status);
            return repository.save(app);
        }
        return null;
    }
}
