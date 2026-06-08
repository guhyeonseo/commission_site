package com.commission.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SellerProfileResponseDto {

    private Long userId;
    private String nickname;

    private Double avgRating;
    private Integer reviewCount;
    
    private String introduction;
}