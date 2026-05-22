package com.commission.payment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfirmRequest {

	private String paymentKey;
    private String orderId;
    private Long amount;
    
}