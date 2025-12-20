package com.shinefiling.certifications.service;

import com.shinefiling.certifications.dto.BarCodeApplicationDTO;
import com.shinefiling.common.model.User;
import com.shinefiling.certifications.model.BarCodeApplication;
import com.shinefiling.common.repository.UserRepository;
import com.shinefiling.certifications.repository.BarCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BarCodeService {
    @Autowired
    private BarCodeRepository barcodeRepository;
    @Autowired
    private UserRepository userRepository;

    public BarCodeApplication createApplication(BarCodeApplicationDTO dto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        BarCodeApplication app = new BarCodeApplication();
        app.setUser(user);
        app.setSubmissionId("BARCODE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        app.setStatus("PENDING");

        app.setBusinessName(dto.getBusinessName());
        app.setBrandName(dto.getBrandName());
        app.setNumberOfBarcodes(dto.getNumberOfBarcodes());
        app.setProductCategory(dto.getProductCategory());
        app.setTurnover(dto.getTurnover());
        app.setMobile(dto.getMobile());
        app.setEmail(dto.getEmail());
        app.setGstNumber(dto.getGstNumber());

        return barcodeRepository.save(app);
    }

    public List<BarCodeApplication> getUserApplications(Long userId) {
        return barcodeRepository.findByUserId(userId);
    }

    public List<BarCodeApplication> getAllApplications() {
        return barcodeRepository.findAll();
    }

    public BarCodeApplication getApplication(Long id) {
        return barcodeRepository.findById(id).orElse(null);
    }

    public BarCodeApplication updateStatus(Long id, String status) {
        BarCodeApplication app = getApplication(id);
        if (app != null) {
            app.setStatus(status);
            return barcodeRepository.save(app);
        }
        return null;
    }
}
