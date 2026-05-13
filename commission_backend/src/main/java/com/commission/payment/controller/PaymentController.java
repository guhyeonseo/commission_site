package com.commission.payment.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commission.payment.dto.PaymentCreateRequest;
import com.commission.payment.dto.PaymentCreateResponse;
import com.commission.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;

    @PostMapping("/create")
    public PaymentCreateResponse create(
            @RequestBody PaymentCreateRequest request
    ) {

        // 임시
        Long buyerId = 1L;

        return paymentService.create(request, buyerId);
    }
}
