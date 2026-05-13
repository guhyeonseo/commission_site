package com.commission.commission.repository;

import java.util.List;

import com.commission.commission.dto.CommissionSearchDto;
import com.commission.commission.entity.Commission;

public interface CommissionRepositoryCustom {
	List<Commission> search(CommissionSearchDto cond);
}
