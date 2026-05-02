package com.commission.commission.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
	private Long commissionId;
    private String requestDetail;
}
