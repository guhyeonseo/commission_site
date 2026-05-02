package com.commission.commission.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderResponse {

	private Long id;
    private Long commissionId;
    private Long buyerId;
    private Long sellerId;
    private String status;
    private String requestDetail;
}
