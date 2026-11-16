package com.rsrp.portal.repository;

import com.rsrp.portal.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    List<User> findByRoleAndApprovalStatus(String role, String approvalStatus);
}
