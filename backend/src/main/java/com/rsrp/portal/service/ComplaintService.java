package com.rsrp.portal.service;

import com.rsrp.portal.model.Complaint;
import com.rsrp.portal.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Map;
import java.util.HashMap;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final Random random = new Random();

    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Complaint submitComplaint(Complaint complaint) {
        // Generate a human-readable unique Complaint ID: RSP-YYYYMMDD-XXXX
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomSuffix = 1000 + random.nextInt(9000); // 4 digit random number
        String customId = "RSP-" + dateStr + "-" + randomSuffix;
        complaint.setComplaintId(customId);

        // Initialize status and status history
        complaint.setStatus("Pending");
        Complaint.StatusHistoryEntry initialHistory = new Complaint.StatusHistoryEntry(
                "Pending",
                "System",
                "Complaint successfully submitted."
        );
        complaint.getStatusHistory().add(initialHistory);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    public Optional<Complaint> getComplaintByCustomId(String complaintId) {
        return complaintRepository.findByComplaintId(complaintId);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Optional<Complaint> updateComplaintStatus(String id, String newStatus, String updatedBy, String notes, String assignedTo) {
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);
        if (existingComplaintOpt.isEmpty()) {
            // Check by custom complaintId as a fallback
            existingComplaintOpt = complaintRepository.findByComplaintId(id);
        }

        if (existingComplaintOpt.isPresent()) {
            Complaint complaint = existingComplaintOpt.get();
            if (newStatus != null && !newStatus.trim().isEmpty()) {
                complaint.setStatus(newStatus);
            }
            if (assignedTo != null) {
                complaint.setAssignedTo(assignedTo);
            }
            
            Complaint.StatusHistoryEntry historyEntry = new Complaint.StatusHistoryEntry(
                    newStatus != null ? newStatus : complaint.getStatus(),
                    updatedBy,
                    notes
            );
            complaint.getStatusHistory().add(historyEntry);
            complaint.setUpdatedAt(LocalDateTime.now());
            
            return Optional.of(complaintRepository.save(complaint));
        }
        return Optional.empty();
    }

    public List<Complaint> getComplaintsByAssignedTo(String assignedTo) {
        return complaintRepository.findByAssignedTo(assignedTo);
    }

    public List<Complaint> getComplaintsByAssignedStaffId(String assignedStaffId) {
        return complaintRepository.findByAssignedStaffId(assignedStaffId);
    }

    public Optional<Complaint> assignComplaint(String id, String staffId, String staffName, String updatedBy) {
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);
        if (existingComplaintOpt.isEmpty()) {
            existingComplaintOpt = complaintRepository.findByComplaintId(id);
        }

        if (existingComplaintOpt.isPresent()) {
            Complaint complaint = existingComplaintOpt.get();
            complaint.setAssignedStaffId(staffId);
            complaint.setAssignedTo(staffName);
            complaint.setStatus("Assigned");

            String notes = "Assigned complaint to field staff: " + staffName + ". Notification triggered.";
            Complaint.StatusHistoryEntry historyEntry = new Complaint.StatusHistoryEntry(
                    "Assigned",
                    updatedBy != null ? updatedBy : "Admin",
                    notes
            );
            complaint.getStatusHistory().add(historyEntry);
            complaint.setUpdatedAt(LocalDateTime.now());

            return Optional.of(complaintRepository.save(complaint));
        }
        return Optional.empty();
    }

    public boolean deleteComplaint(String id) {
        Optional<Complaint> existingComplaintOpt = complaintRepository.findById(id);
        if (existingComplaintOpt.isEmpty()) {
            existingComplaintOpt = complaintRepository.findByComplaintId(id);
        }

        if (existingComplaintOpt.isPresent()) {
            complaintRepository.delete(existingComplaintOpt.get());
            return true;
        }
        return false;
    }

    public List<Complaint> getComplaintsBySubmittedBy(String submittedBy) {
        return complaintRepository.findBySubmittedBy(submittedBy);
    }

    public List<Complaint> getComplaintsByCitizenId(String citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }

    public Map<String, Object> getDashboardStats() {
        List<Complaint> complaints = getAllComplaints();
        long total = complaints.size();
        
        Map<String, Long> byType = new HashMap<>();
        byType.put("streetlight", 0L);
        byType.put("water", 0L);
        byType.put("road", 0L);
        byType.put("others", 0L);

        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("Pending", 0L);
        byStatus.put("In Progress", 0L);
        byStatus.put("Resolved", 0L);
        
        for (Complaint c : complaints) {
            String type = c.getType() != null ? c.getType().toLowerCase() : "unknown";
            byType.put(type, byType.getOrDefault(type, 0L) + 1);
            
            String status = c.getStatus() != null ? c.getStatus() : "Pending";
            byStatus.put(status, byStatus.getOrDefault(status, 0L) + 1);
        }
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("byType", byType);
        stats.put("byStatus", byStatus);
        
        return stats;
    }

    public List<Complaint> filterComplaints(String type, String status, String area) {
        List<Complaint> complaints = getAllComplaints();
        return complaints.stream()
                .filter(c -> type == null || type.trim().isEmpty() || (c.getType() != null && c.getType().equalsIgnoreCase(type)))
                .filter(c -> status == null || status.trim().isEmpty() || (c.getStatus() != null && c.getStatus().equalsIgnoreCase(status)))
                .filter(c -> area == null || area.trim().isEmpty() || (c.getLocation() != null && c.getLocation().toLowerCase().contains(area.toLowerCase())))
                .collect(java.util.stream.Collectors.toList());
    }
}
