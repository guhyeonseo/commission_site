package com.commission.commission.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReviewResponse {
	
    private Long id;
    private Long paymentId;
    private Long writerId;
    private String writerNickname;
    
    private Double rating;
    private String content;
    private String createdAt;
}
