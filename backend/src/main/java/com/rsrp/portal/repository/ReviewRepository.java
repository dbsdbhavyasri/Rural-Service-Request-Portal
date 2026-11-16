package com.rsrp.portal.repository;

import com.rsrp.portal.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findAllByOrderByCreatedAtDesc();
}
