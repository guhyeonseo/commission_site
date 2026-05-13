package com.commission.commission.repository;

import java.util.List;

import com.commission.commission.dto.CommissionSearchDto;
import com.commission.commission.entity.CommissionEntity;

public interface CommissionRepositoryCustom {
	List<CommissionEntity> search(CommissionSearchDto cond);
}
