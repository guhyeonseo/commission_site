package com.commission.payment.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.payment.entity.Payment;
import com.commission.payment.entity.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

	Optional<Payment> findByOrderId(String orderId);
	
	List<Payment> findByCommission_UserId(Long userId);
	
	List<Payment> findByBuyer_Id(Long buyerId);
	
	boolean existsByBuyer_IdAndCommission_IdAndStatusIn(
	        Long buyerId,
	        Long commissionId,
	        List<PaymentStatus> statuses
	);
}
