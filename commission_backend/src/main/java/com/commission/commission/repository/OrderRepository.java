package com.commission.commission.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.commission.entity.OrderEntity;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

}