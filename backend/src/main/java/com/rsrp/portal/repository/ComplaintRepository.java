package com.rsrp.portal.repository;

import com.rsrp.portal.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ComplaintRepository extends MongoRepository<Complaint, String> {
    Optional<Complaint> findByComplaintId(String complaintId);
    List<Complaint> findBySubmittedBy(String submittedBy);
    List<Complaint> findByCitizenId(String citizenId);
    List<Complaint> findByAssignedTo(String assignedTo);
    List<Complaint> findByAssignedStaffId(String assignedStaffId);
}
