package com.commission.commission.dto;

import lombok.Data;

@Data
public class CommissionCreateDto {

	private String title;
    private String description;
    private int price;
    private int estimatedDays;
    private String category;
}
