package com.commission.commission.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.commission.entity.Commission;

public interface CommissionRepository extends JpaRepository<Commission, Long>, CommissionRepositoryCustom{

	List<Commission> findByUserId(Long userId);
}
	