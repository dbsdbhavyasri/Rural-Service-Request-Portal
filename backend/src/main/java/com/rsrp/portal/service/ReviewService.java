package com.rsrp.portal.service;

import com.rsrp.portal.model.Review;
import com.rsrp.portal.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review createReview(Review review, String username) {
        review.setSubmittedBy(username);
        review.setAuthorName(username);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }
}
