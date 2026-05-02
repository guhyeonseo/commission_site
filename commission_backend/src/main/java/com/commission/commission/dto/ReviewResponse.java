package com.commission.commission.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReviewResponse {
	
    private Long id;
    private Long orderId;
    private Long writerId;
    private Double rating;
    private String content;
    private String createdAt;
}
