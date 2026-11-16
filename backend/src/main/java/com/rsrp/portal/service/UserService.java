package com.rsrp.portal.service;

import com.rsrp.portal.model.User;
import com.rsrp.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> authenticate(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if ("STAFF".equalsIgnoreCase(user.getRole())) {
                if ("Pending".equalsIgnoreCase(user.getApprovalStatus())) {
                    throw new IllegalStateException("Staff account registration is pending admin approval.");
                }
                if ("Rejected".equalsIgnoreCase(user.getApprovalStatus())) {
                    throw new IllegalStateException("Staff account registration was rejected by administrator.");
                }
            }
        }
        return userOpt;
    }

    public User registerUser(String username, String password, String phone, String role, String specialization) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = new User(username, passwordEncoder.encode(password), phone);
        String finalRole = role != null ? role.toUpperCase() : "CITIZEN";
        user.setRole(finalRole);
        user.setSpecialization(specialization);
        if ("STAFF".equalsIgnoreCase(finalRole)) {
            user.setApprovalStatus("Pending");
        } else {
            user.setApprovalStatus("Approved");
        }
        return userRepository.save(user);
    }

    public java.util.List<User> getFieldStaff() {
        return userRepository.findByRole("STAFF");
    }

    public java.util.List<User> getApprovedFieldStaff() {
        return userRepository.findByRoleAndApprovalStatus("STAFF", "Approved");
    }

    public java.util.List<User> getPendingStaff() {
        return userRepository.findByRoleAndApprovalStatus("STAFF", "Pending");
    }

    public User approveStaff(String id, String status) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        User user = userOpt.get();
        if (!"STAFF".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Target user is not a staff member");
        }
        user.setApprovalStatus(status != null ? status : "Approved");
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
}
