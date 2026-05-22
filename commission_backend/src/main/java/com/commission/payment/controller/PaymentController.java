package com.commission.payment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.commission.payment.dto.PaymentConfirmRequest;
import com.commission.payment.dto.PaymentCreateRequest;
import com.commission.payment.dto.PaymentCreateResponse;
import com.commission.payment.dto.PaymentResponseDto;
import com.commission.payment.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;

    @PostMapping("/create")
    public PaymentCreateResponse create(
            @RequestBody PaymentCreateRequest request,
            Authentication authentication
    ) {

    	Long buyerId = (Long) authentication.getPrincipal();
    	
        return paymentService.create(request, buyerId);
    }
    
    @PostMapping("/confirm")
    public ResponseEntity<?> confirm(
            @RequestBody PaymentConfirmRequest request
    ) {

        paymentService.confirmPayment(request);

        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/{paymentId}/start")
    public void start(
            @PathVariable("paymentId") Long paymentId,
            Authentication authentication
    ) {

        Long userId =
                (Long) authentication.getPrincipal();

        paymentService.startWork(
                paymentId,
                userId
        );
    }
    
    @PatchMapping("/{paymentId}/work-done")
    public void workDone(
            @PathVariable("paymentId") Long paymentId,
            Authentication authentication
    ) {
    	
    	Long userId = (Long) authentication.getPrincipal();

    	paymentService.workDone(paymentId,userId);
    }
    
    @PatchMapping("/{paymentId}/confirm")
    public void confirm(
            @PathVariable("paymentId") Long paymentId
    ) {

        paymentService.confirm(paymentId);
    }
    
    @GetMapping("/artist")
    public List<PaymentResponseDto> artistOrders(
            Authentication authentication
    ) {

        Long userId =
                (Long) authentication.getPrincipal();

        return paymentService.getArtistOrders(
                userId
        );
    }
    
    @GetMapping("/buyer")
    public List<PaymentResponseDto>
    buyerOrders(
            Authentication authentication
    ) {

        Long userId =
                (Long) authentication.getPrincipal();
        
        System.out.println("@@@@@@@@@@@@"+userId);

        return paymentService
                .getBuyerOrders(userId);
    }
    
    @PatchMapping("/{paymentId}/complete")
    public void complete(
            @PathVariable("paymentId") Long paymentId,
            Authentication authentication
    ) {
    	
    	Long userId = (Long) authentication.getPrincipal();

        paymentService.complete(paymentId,userId);
    }
    
    @PatchMapping("/{paymentId}/cancel")
    public void cancel(
            @PathVariable("paymentId") Long paymentId,
            Authentication authentication
    ) {

        Long userId =
                (Long) authentication.getPrincipal();

        paymentService.cancel(
                paymentId,
                userId
        );
    }
    
    @PatchMapping("/{paymentId}/result")
    public void uploadResult(
            @PathVariable("paymentId") Long paymentId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws Exception {

        Long userId =
                (Long) authentication.getPrincipal();

        paymentService.uploadResult(
                paymentId,
                file,
                userId
        );
    }
    
}
