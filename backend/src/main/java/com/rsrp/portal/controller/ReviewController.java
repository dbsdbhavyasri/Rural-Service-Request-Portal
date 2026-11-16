package com.rsrp.portal.controller;

import com.rsrp.portal.model.Review;
import com.rsrp.portal.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody Review review, Principal principal) {
        if (review.getText() == null || review.getText().trim().isEmpty()
                || review.getText().trim().length() > 500
                || review.getRating() < 1 || review.getRating() > 5) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Review text must be 1-500 characters and rating must be between 1 and 5."));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reviewService.createReview(review, principal.getName()));
    }
}
