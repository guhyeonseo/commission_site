package com.commission.commission.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommissionSearchDto {

	private String keyword;
    private Integer minPrice;
    private Integer maxPrice;
    private String category;
    private String sort;
    
    private Integer page = 0;
    private Integer size = 10;
}
