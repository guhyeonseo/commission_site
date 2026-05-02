package com.commission.commission.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryRequest {
	
	private Long commissionId;
    private String content;
    private Boolean isSecret;
    private Long parentId;
}
