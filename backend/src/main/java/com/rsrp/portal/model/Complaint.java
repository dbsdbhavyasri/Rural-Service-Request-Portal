package com.rsrp.portal.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "complaints")
public class Complaint {

    @Id
    private String id;

    private String complaintId;

    @NotBlank(message = "Complaint type is required")
    private String type; // streetlight / water / road

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Address is required")
    private String address;

    private GpsCoords gpsCoords;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be a valid 10-digit number")
    private String phone;

    private List<String> photos = new ArrayList<>();

    private String status = "Pending"; // Pending / In Progress / Resolved

    private List<StatusHistoryEntry> statusHistory = new ArrayList<>();

    private String assignedTo;

    private String assignedStaffId;

    private String submittedBy;

    private String citizenId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Constructors
    public Complaint() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Complaint(String type, String location, String description, String phone) {
        this();
        this.type = type;
        this.location = location;
        this.description = description;
        this.phone = phone;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public GpsCoords getGpsCoords() {
        return gpsCoords;
    }

    public void setGpsCoords(GpsCoords gpsCoords) {
        this.gpsCoords = gpsCoords;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<String> getPhotos() {
        return photos;
    }

    public void setPhotos(List<String> photos) {
        this.photos = photos;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public List<StatusHistoryEntry> getStatusHistory() {
        return statusHistory;
    }

    public void setStatusHistory(List<StatusHistoryEntry> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getAssignedStaffId() {
        return assignedStaffId;
    }

    public void setAssignedStaffId(String assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getCitizenId() {
        return citizenId;
    }

    public void setCitizenId(String citizenId) {
        this.citizenId = citizenId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Inner classes for structured data
    public static class GpsCoords {
        private Double lat;
        private Double lng;

        public GpsCoords() {
        }

        public GpsCoords(Double lat, Double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public Double getLat() {
            return lat;
        }

        public void setLat(Double lat) {
            this.lat = lat;
        }

        public Double getLng() {
            return lng;
        }

        public void setLng(Double lng) {
            this.lng = lng;
        }
    }

    public static class StatusHistoryEntry {
        private String status;
        private String updatedBy;
        private LocalDateTime timestamp;
        private String notes;

        public StatusHistoryEntry() {
            this.timestamp = LocalDateTime.now();
        }

        public StatusHistoryEntry(String status, String updatedBy, String notes) {
            this();
            this.status = status;
            this.updatedBy = updatedBy;
            this.notes = notes;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getUpdatedBy() {
            return updatedBy;
        }

        public void setUpdatedBy(String updatedBy) {
            this.updatedBy = updatedBy;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
