package com.commission.commission.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.commission.commission.dto.CommissionSearchDto;
import com.commission.commission.entity.Commission;

public interface CommissionRepositoryCustom {
	
	Page<Commission> search(
	        CommissionSearchDto cond,
	        Pageable pageable
	);
	
}
