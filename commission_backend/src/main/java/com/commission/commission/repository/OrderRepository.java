package com.commission.commission.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.commission.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}