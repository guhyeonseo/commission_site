package com.commission.payment.service;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.commission.commission.entity.Commission;
import com.commission.commission.repository.CommissionRepository;
import com.commission.common.file.FileService;
import com.commission.payment.dto.PaymentConfirmRequest;
import com.commission.payment.dto.PaymentCreateRequest;
import com.commission.payment.dto.PaymentCreateResponse;
import com.commission.payment.dto.PaymentResponseDto;
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
	private final FileService fileService;

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
        
        boolean exists =
                paymentRepository
                .existsByBuyer_IdAndCommission_IdAndStatusIn(
                        buyerId,
                        commission.getId(),
                        List.of(
                        		PaymentStatus.READY,
                        	    PaymentStatus.WAITING_START,
                        	    PaymentStatus.IN_PROGRESS,
                        	    PaymentStatus.WORK_DONE
                        )
                );

        if (exists) {

            throw new RuntimeException(
                    "이미 진행중인 주문이 있습니다."
            );
        }

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
    
    public void confirmPayment(
            PaymentConfirmRequest request
    ) {

        String secretKey = "test_sk_6BYq7GWPVvelWz6457KL3NE5vbo1";

        String encodedKey = Base64.getEncoder()
                .encodeToString(
                        (secretKey + ":").getBytes()
                );

        RestTemplate restTemplate =
                new RestTemplate();

        HttpHeaders headers =
                new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON
        );

        headers.set(
                "Authorization",
                "Basic " + encodedKey
        );

        Map<String, Object> body =
                new HashMap<>();

        body.put(
                "paymentKey",
                request.getPaymentKey()
        );

        body.put(
                "orderId",
                request.getOrderId()
        );

        body.put(
                "amount",
                request.getAmount()
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        "https://api.tosspayments.com/v1/payments/confirm",
                        entity,
                        String.class
                );

        System.out.println(response.getBody());

        // DB 결제 완료 처리
        
        Payment payment = paymentRepository
                .findByOrderId(
                        request.getOrderId()
                )
                .orElseThrow();

        payment.setStatus(
        	    PaymentStatus.WAITING_START
        	);

        paymentRepository.save(payment);

    }
    
    @Transactional
    public void startWork(
            Long paymentId,
            Long userId
    ) {

        Payment payment =
                paymentRepository.findById(paymentId)
                .orElseThrow();
        
        System.out.println(
                "로그인 유저: " + userId
        );

        System.out.println(
                "커미션 작가: " +
                payment.getCommission().getUserId()
        );

        System.out.println(
                "현재 상태: " +
                payment.getStatus()
        );

        // 작가 체크
        if (!payment.getCommission()
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "권한 없음"
            );
        }

        // 상태 체크
        if (payment.getStatus()
                != PaymentStatus.WAITING_START) {

            throw new RuntimeException(
                    "시작 불가 상태"
            );
        }

        payment.setStatus(
                PaymentStatus.IN_PROGRESS
        );
    }
    
    @Transactional
    public void workDone(
            Long paymentId,
            Long userId
    ) {

        Payment payment =
                paymentRepository.findById(paymentId)
                .orElseThrow();

        // 작가 본인인지 체크
        if (!payment.getCommission()
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "권한 없음"
            );
        }

        payment.setStatus(
                PaymentStatus.WORK_DONE
        );
    }
    
    @Transactional
    public void confirm(Long paymentId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                .orElseThrow();

        payment.setStatus(
                PaymentStatus.COMPLETED
        );
    }
    
    @Transactional(readOnly = true)
    public List<PaymentResponseDto> getArtistOrders(
            Long userId
    ) {

        return paymentRepository
                .findByCommission_UserId(userId)
                .stream()
                .map(PaymentResponseDto::from)
                .toList();
    }

    public List<PaymentResponseDto>
    getBuyerOrders(Long buyerId) {

        return paymentRepository
                .findByBuyer_Id(buyerId)
                .stream()
                .map(PaymentResponseDto::from)
                .toList();
    }
    
    @Transactional
    public void complete(Long paymentId ,Long userId) {

        Payment payment =
                paymentRepository.findById(paymentId)
                .orElseThrow();
        
        if (!payment.getBuyer()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "권한 없음"
            );
        }

        payment.setStatus(
                PaymentStatus.COMPLETED
        );

        paymentRepository.save(payment);
    }
    
    @Transactional
    public void cancel(
            Long paymentId,
            Long userId
    ) {

        Payment payment =
                paymentRepository.findById(paymentId)
                .orElseThrow();

        // 구매자 본인 체크
        if (!payment.getBuyer()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "권한 없음"
            );
        }

        // 작업 시작 전만 취소 가능
        if (
            payment.getStatus()
            != PaymentStatus.WAITING_START
        ) {

            throw new RuntimeException(
                    "취소 불가 상태"
            );
        }

        payment.setStatus(
                PaymentStatus.CANCELED
        );

        paymentRepository.save(payment);
    }
    
    @Transactional
    public void uploadResult(
            Long paymentId,
            MultipartFile file,
            Long userId
    ) throws Exception {

        Payment payment =
                paymentRepository.findById(paymentId)
                .orElseThrow();

        // 작가 권한 체크
        if (!payment.getCommission()
                .getUserId()
                .equals(userId)) {

            throw new RuntimeException(
                    "권한 없음"
            );
        }

        String resultUrl =
                fileService.saveFile(
                        file,
                        "results"
                );

        payment.setResultUrl(
                resultUrl
        );

        payment.setStatus(
                PaymentStatus.WORK_DONE
        );
    }
    
}
