package com.commission.payment.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.commission.entity.Commission;
import com.commission.commission.repository.CommissionRepository;
import com.commission.payment.dto.PaymentCreateRequest;
import com.commission.payment.dto.PaymentCreateResponse;
import com.commission.payment.entity.Payment;
import com.commission.payment.entity.PaymentStatus;
import com.commission.payment.repository.PaymentRepository;
import com.commission.user.entity.User;
import com.commission.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
	
	 private final PaymentRepository paymentRepository;
	    private final CommissionRepository commissionRepository;
	    private final UserRepository userRepository;

	    @Transactional
	    public PaymentCreateResponse create(
	            PaymentCreateRequest request,
	            Long buyerId
	    ) {

	        Commission commission = commissionRepository.findById(
	                request.getCommissionId()
	        ).orElseThrow();

	        User buyer = userRepository.findById(buyerId)
	                .orElseThrow();

	        String orderId = UUID.randomUUID().toString();

	        Payment payment = Payment.builder()
	                .commission(commission)
	                .buyer(buyer)
	                .amount(commission.getPrice())
	                .orderId(orderId)
	                .status(PaymentStatus.READY)
	                .build();

	        paymentRepository.save(payment);

	        return new PaymentCreateResponse(
	                orderId,
	                commission.getPrice()
	        );
	    }

}
