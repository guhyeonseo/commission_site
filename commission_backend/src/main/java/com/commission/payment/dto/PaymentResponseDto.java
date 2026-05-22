package com.commission.payment.dto;

import com.commission.payment.entity.Payment;
import com.commission.payment.entity.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentResponseDto {

	private Long id;
	
	private Long commissionId;

    private String commissionTitle;

    private String buyerNickname;

    private int amount;

    private PaymentStatus status;
    
    private String resultUrl;

    public static PaymentResponseDto from(
            Payment payment
    ) {

        return new PaymentResponseDto(
                payment.getId(),
                
                payment.getCommission()
                		.getId(),

                payment.getCommission()
                        .getTitle(),

                payment.getBuyer()
                        .getNickname(),

                payment.getAmount(),

                payment.getStatus(),
                
                payment.getResultUrl()
        );
    }
	
}
