package com.commission.commission.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.commission.dto.InquiryRequest;
import com.commission.commission.dto.InquiryResponse;
import com.commission.commission.entity.CommissionEntity;
import com.commission.commission.repository.CommissionRepository;
import com.commission.commission.repository.InquiryRepository;

import lombok.RequiredArgsConstructor;

import com.commission.commission.entity.InquiryEntity;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final CommissionRepository commissionRepository;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    
    // 문의 작성
    @Transactional
    public void createInquiry(InquiryRequest dto, Long userId) {

        CommissionEntity commission = commissionRepository.findById(dto.getCommissionId())
                .orElseThrow(() -> new RuntimeException("글 없음"));

        InquiryEntity inquiry = InquiryEntity.builder()
                .commission(commission)
                .writerId(userId)
                .content(dto.getContent())
                .isSecret(dto.getIsSecret())
                .parentId(dto.getParentId())
                .build();

        inquiryRepository.save(inquiry);
    }

    // 문의 조회 (비밀글 처리 포함)
    public List<InquiryResponse> getInquiries(Long commissionId, Authentication auth) {

        Long userId = null;

        if (auth != null) {
            try {
                userId = Long.parseLong(auth.getName());
            } catch (Exception e) {
                userId = null; 
            }
        }

        List<InquiryEntity> list = inquiryRepository.findByCommission_Id(commissionId);

        Long finalUserId = userId;

        return list.stream().map(i -> {

            boolean canView =
                    !i.isSecret() ||
                    (finalUserId != null && (
                            i.getWriterId().equals(finalUserId) ||
                            i.getCommission().getUserId().equals(finalUserId)
                    ));

            return InquiryResponse.builder()
                    .id(i.getId())
                    .writerId(canView ? i.getWriterId() : null)
                    .content(canView ? i.getContent() : null)
                    .isSecret(i.isSecret())
                    .canView(canView)
                    .parentId(i.getParentId())
                    .createdAt(i.getCreatedAt().format(FORMATTER))
                    .build();

        }).toList();
    }
    
    // 문의 수정
    @Transactional
    public void updateInquiry(Long inquiryId, InquiryRequest dto, Long userId) {

        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        // 권한 체크 (작성자만 수정 가능)
        if (!inquiry.getWriterId().equals(userId)) {
            throw new RuntimeException("수정 권한 없음");
        }

        inquiry.setContent(dto.getContent());
    }
    
    // 문의 삭제
    @Transactional
    public void deleteInquiry(Long inquiryId, Long userId) {

        InquiryEntity inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        // 권한 체크 (작성자 or 게시글 주인)
        boolean isOwner = inquiry.getWriterId().equals(userId);
        boolean isCommissionOwner = inquiry.getCommission().getUserId().equals(userId);

        if (!isOwner && !isCommissionOwner) {
            throw new RuntimeException("삭제 권한 없음");
        }

        inquiryRepository.delete(inquiry);
    }
}

