package com.commission.commission.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {

    private Long orderId;
    private Double rating;
    private String content;
}
