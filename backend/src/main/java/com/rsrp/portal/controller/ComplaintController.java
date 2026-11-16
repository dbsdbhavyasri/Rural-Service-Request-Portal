package com.rsrp.portal.controller;

import com.rsrp.portal.model.Complaint;
import com.rsrp.portal.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final com.rsrp.portal.service.UserService userService;

    @Autowired
    public ComplaintController(ComplaintService complaintService, com.rsrp.portal.service.UserService userService) {
        this.complaintService = complaintService;
        this.userService = userService;
    }

    // Citizens submit a new complaint
    @PostMapping("/submit")
    public ResponseEntity<Complaint> submitComplaint(@Valid @RequestBody Complaint complaint, java.security.Principal principal) {
        if (principal != null) {
            complaint.setSubmittedBy(principal.getName());
            userService.findByUsername(principal.getName()).ifPresent(user -> {
                complaint.setCitizenId(user.getId());
            });
        }
        Complaint savedComplaint = complaintService.submitComplaint(complaint);
        return new ResponseEntity<>(savedComplaint, HttpStatus.CREATED);
    }

    // Citizens retrieve their own complaints
    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> getMyComplaints(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Complaint> complaints = complaintService.getComplaintsBySubmittedBy(principal.getName());
        if (complaints.isEmpty()) {
            Optional<com.rsrp.portal.model.User> userOpt = userService.findByUsername(principal.getName());
            if (userOpt.isPresent()) {
                complaints = complaintService.getComplaintsByCitizenId(userOpt.get().getId());
            }
        }
        return ResponseEntity.ok(complaints);
    }

    // Citizens track complaint by custom Complaint ID or DB ID
    @GetMapping("/track/{id}")
    public ResponseEntity<?> trackComplaint(@PathVariable String id) {
        Optional<Complaint> complaintOpt = complaintService.getComplaintByCustomId(id);
        if (complaintOpt.isEmpty()) {
            // Check by DB ID as a fallback if not found by custom ID
            complaintOpt = complaintService.getAllComplaints().stream()
                    .filter(c -> c.getId() != null && c.getId().equals(id))
                    .findFirst();
        }
        
        if (complaintOpt.isPresent()) {
            return ResponseEntity.ok(complaintOpt.get());
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Complaint not found");
            errorResponse.put("message", "No complaint exists with the ID: " + id);
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    // Admin view all complaints
    @GetMapping("/all")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> complaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(complaints);
    }

    // Admin assign complaint to staff: PUT /api/complaints/assign/{id}
    @PutMapping("/assign/{id}")
    public ResponseEntity<?> assignComplaint(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody,
            java.security.Principal principal) {
        
        String staffId = requestBody.get("staffId");
        String staffName = requestBody.get("assignedTo");

        if (staffId == null && staffName == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid Request");
            errorResponse.put("message", "staffId or assignedTo is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (staffId != null && (staffName == null || staffName.trim().isEmpty())) {
            Optional<com.rsrp.portal.model.User> staffOpt = userService.findById(staffId);
            if (staffOpt.isPresent()) {
                staffName = staffOpt.get().getUsername();
            }
        } else if (staffName != null && (staffId == null || staffId.trim().isEmpty())) {
            Optional<com.rsrp.portal.model.User> staffOpt = userService.findByUsername(staffName);
            if (staffOpt.isPresent()) {
                staffId = staffOpt.get().getId();
            }
        }

        String updatedBy = principal != null ? principal.getName() : "Admin";
        Optional<Complaint> updated = complaintService.assignComplaint(id, staffId, staffName, updatedBy);
        if (updated.isPresent()) {
            return ResponseEntity.ok(updated.get());
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Complaint not found");
            errorResponse.put("message", "No complaint exists to assign with the ID: " + id);
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    // Admin update status of a complaint
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> requestBody) {
        
        String newStatus = requestBody.get("status");
        String updatedBy = requestBody.getOrDefault("updatedBy", "Admin");
        String notes = requestBody.getOrDefault("notes", "Status updated.");
        String assignedTo = requestBody.get("assignedTo");

        if ((newStatus == null || newStatus.trim().isEmpty()) && assignedTo == null) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid Request");
            errorResponse.put("message", "Status or assignedTo field is required");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        Optional<Complaint> updatedComplaint = complaintService.updateComplaintStatus(id, newStatus, updatedBy, notes, assignedTo);
        if (updatedComplaint.isPresent()) {
            return ResponseEntity.ok(updatedComplaint.get());
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Complaint not found");
            errorResponse.put("message", "No complaint exists to update with the ID: " + id);
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    // Field staff retrieve their assigned complaints
    @GetMapping("/assigned")
    public ResponseEntity<List<Complaint>> getAssignedComplaints(java.security.Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Complaint> complaints = complaintService.getComplaintsByAssignedTo(principal.getName());
        if (complaints.isEmpty()) {
            Optional<com.rsrp.portal.model.User> userOpt = userService.findByUsername(principal.getName());
            if (userOpt.isPresent()) {
                complaints = complaintService.getComplaintsByAssignedStaffId(userOpt.get().getId());
            }
        }
        return ResponseEntity.ok(complaints);
    }

    // Admin delete a complaint
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable String id) {
        boolean deleted = complaintService.deleteComplaint(id);
        if (deleted) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Complaint deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Complaint not found");
            errorResponse.put("message", "No complaint exists to delete with the ID: " + id);
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }

    // Admin get dashboard statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = complaintService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    // Admin filter complaints
    @GetMapping("/filter")
    public ResponseEntity<List<Complaint>> filterComplaints(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String area) {
        List<Complaint> filtered = complaintService.filterComplaints(type, status, area);
        return ResponseEntity.ok(filtered);
    }

    // Handle Validation Errors
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}
