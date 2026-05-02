package com.commission.commission.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.commission.commission.dto.InquiryRequest;
import com.commission.commission.dto.InquiryResponse;
import com.commission.commission.service.InquiryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    // 문의 작성
    @PostMapping
    public ResponseEntity<?> createInquiry(
            @RequestBody InquiryRequest dto,
            Authentication auth
    ) {
    	
    	Long userId = Long.parseLong(auth.getName());
    	
        inquiryService.createInquiry(dto, userId);
        return ResponseEntity.ok().build();
    }

    // 문의 리스트 조회
    @GetMapping("/{commissionId}")
    public ResponseEntity<List<InquiryResponse>> getInquiries(
    		@PathVariable("commissionId") Long commissionId,
    		Authentication auth
    ) {
    	return ResponseEntity.ok(
    	        inquiryService.getInquiries(commissionId, auth)
    	);
    }
    
    // 문의 수정 
    @PatchMapping("/{inquiryId}")
    public void updateInquiry(
            @PathVariable("inquiryId") Long inquiryId,
            @RequestBody InquiryRequest dto,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        inquiryService.updateInquiry(inquiryId, dto, userId);
    }
    
    // 문의 삭제
    @DeleteMapping("/{inquiryId}")
    public void deleteInquiry(
            @PathVariable("inquiryId") Long inquiryId,
            Authentication auth
    ) {
        Long userId = Long.parseLong(auth.getName());
        inquiryService.deleteInquiry(inquiryId, userId);
    }
    
}