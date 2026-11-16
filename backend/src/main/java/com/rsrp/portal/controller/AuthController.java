package com.rsrp.portal.controller;

import com.rsrp.portal.model.Admin;
import com.rsrp.portal.model.User;
import com.rsrp.portal.service.AdminService;
import com.rsrp.portal.service.JwtService;
import com.rsrp.portal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminService adminService;
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AdminService adminService, UserService userService, JwtService jwtService) {
        this.adminService = adminService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (username == null || password == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid arguments");
            error.put("message", "Username and password are required");
            return ResponseEntity.badRequest().body(error);
        }

        // Check if Admin
        Optional<Admin> adminOpt = adminService.authenticate(username, password);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            String token = jwtService.generateToken(admin.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", admin.getId());
            response.put("username", admin.getUsername());
            response.put("role", "ADMIN");
            return ResponseEntity.ok(response);
        }

        // Check if User (Citizen or Staff)
        try {
            Optional<User> userOpt = userService.authenticate(username, password);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = jwtService.generateToken(user.getUsername());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("userId", user.getId());
                response.put("username", user.getUsername());
                response.put("phone", user.getPhone());
                response.put("role", user.getRole());
                response.put("specialization", user.getSpecialization());
                response.put("approvalStatus", user.getApprovalStatus());
                return ResponseEntity.ok(response);
            }
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Forbidden");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        Map<String, String> error = new HashMap<>();
        error.put("error", "Unauthorized");
        error.put("message", "Invalid username or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        String phone = request.get("phone");
        String role = request.getOrDefault("role", "CITIZEN");
        String specialization = request.get("specialization");

        if (username == null || password == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid arguments");
            error.put("message", "Username and password are required");
            return ResponseEntity.badRequest().body(error);
        }

        if (!"ADMIN".equalsIgnoreCase(role) && (phone == null || !phone.matches("^[0-9]{10}$"))) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid phone number");
            error.put("message", "Phone number must be exactly 10 digits");
            return ResponseEntity.badRequest().body(error);
        }

        if ("ADMIN".equalsIgnoreCase(role)) {
            try {
                Admin registered = adminService.registerAdmin(username, password);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Admin registered successfully");
                response.put("username", registered.getUsername());
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Conflict");
                error.put("message", e.getMessage());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }
        }

        try {
            User registered = userService.registerUser(username, password, phone, role, specialization);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("userId", registered.getId());
            response.put("username", registered.getUsername());
            response.put("role", registered.getRole());
            response.put("approvalStatus", registered.getApprovalStatus());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Conflict");
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
    }

    @PostMapping("/citizen/login")
    public ResponseEntity<?> citizenLogin(@RequestBody Map<String, String> request) {
        return login(request);
    }

    @PostMapping("/citizen/register")
    public ResponseEntity<?> citizenRegister(@RequestBody Map<String, String> request) {
        return register(request);
    }

    @GetMapping("/staff")
    public ResponseEntity<java.util.List<User>> getFieldStaff() {
        return ResponseEntity.ok(userService.getFieldStaff());
    }

    @GetMapping("/staff/pending")
    public ResponseEntity<java.util.List<User>> getPendingStaff() {
        return ResponseEntity.ok(userService.getPendingStaff());
    }

    @PutMapping("/staff/approve/{id}")
    public ResponseEntity<?> approveStaff(@PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String status = body != null && body.containsKey("status") ? body.get("status") : "Approved";
        try {
            User updated = userService.approveStaff(id, status);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Staff account " + status.toLowerCase() + " successfully");
            response.put("userId", updated.getId());
            response.put("username", updated.getUsername());
            response.put("approvalStatus", updated.getApprovalStatus());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Bad Request");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
