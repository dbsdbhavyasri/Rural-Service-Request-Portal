package com.rsrp.portal.service;

import com.rsrp.portal.model.Admin;
import com.rsrp.portal.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, BCryptPasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initDefaultAdmin() {
        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin("admin", passwordEncoder.encode("password123"));
            adminRepository.save(defaultAdmin);
            System.out.println("Default admin initialized: admin / password123");
        }
    }

    public Optional<Admin> authenticate(String username, String password) {
        return adminRepository.findByUsername(username)
                .filter(admin -> passwordEncoder.matches(password, admin.getPassword()));
    }

    public Admin registerAdmin(String username, String password) {
        if (adminRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        Admin admin = new Admin(username, passwordEncoder.encode(password));
        return adminRepository.save(admin);
    }
}
