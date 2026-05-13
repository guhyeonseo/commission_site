package com.commission.commission.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class InquiryRequest {
	
	private Long commissionId;
    private String content;
    private Boolean isSecret;
    private Long parentId;
}
