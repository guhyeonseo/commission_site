package com.commission.commission.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commission.commission.dto.ReviewRequest;
import com.commission.commission.dto.ReviewResponse;
import com.commission.commission.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reviews")
public class ReviewController {

	private final ReviewService reviewService;
	
	@PostMapping
	 public void createReview(
	            @RequestBody ReviewRequest dto,
	            Authentication authentication
	    ) {

	        Long userId = (Long) authentication.getPrincipal();

	        reviewService.createReview(
	                dto,
	                userId
	        );
	    }
	
	@GetMapping("/commission/{commissionId}")
	public List<ReviewResponse> getReviews(
	        @PathVariable("commissionId") Long commissionId
	) {
	    return reviewService.getReviews(commissionId);
	}
	
	@GetMapping("/my")
    public List<ReviewResponse> getMyReviews(
            Authentication authentication
    ) {
        Long userId =
                Long.valueOf(authentication.getName());

        return reviewService.getMyReviews(userId);
    }
	
}
