package com.commission.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentCreateResponse {

	private String orderId;
    private Integer amount;
}
