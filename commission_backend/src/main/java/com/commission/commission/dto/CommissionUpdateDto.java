package com.commission.commission.dto;

import lombok.Data;

@Data
public class CommissionUpdateDto {
	
	private String title;
    private String description;
    private int price;
    private int estimatedDays;
    private String category;
}
