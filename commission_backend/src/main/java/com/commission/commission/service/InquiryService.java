package com.commission.commission.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.commission.dto.InquiryRequest;
import com.commission.commission.dto.InquiryResponse;
import com.commission.commission.entity.Commission;
import com.commission.commission.repository.CommissionRepository;
import com.commission.commission.repository.InquiryRepository;

import lombok.RequiredArgsConstructor;

import com.commission.commission.entity.Inquiry;

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

        System.out.println("dto = " + dto);
        System.out.println("commissionId = " + dto.getCommissionId());

        Commission commission = commissionRepository.findById(dto.getCommissionId())
                .orElseThrow(() -> new RuntimeException("글 없음"));

        boolean isSecret = dto.getIsSecret();

        if (dto.getParentId() != null) {

            Inquiry parent = inquiryRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new RuntimeException("부모 문의 없음"));

            // 게시글 작성자만 답글 가능
            if (!commission.getUserId().equals(userId)) {
                throw new RuntimeException("답글 권한 없음");
            }

            // 부모가 비밀글이면 답글도 강제 비밀글
            if (parent.isSecret()) {
                isSecret = true;
            }
        }

        Inquiry inquiry = Inquiry.builder()
                .commission(commission)
                .writerId(userId)
                .content(dto.getContent())
                .isSecret(isSecret)
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

        List<Inquiry> list = inquiryRepository.findByCommission_Id(commissionId);

        Long finalUserId = userId;

        return list.stream().map(i -> {

        	boolean canView = !i.isSecret();

        	if (!canView && finalUserId != null) {

        	    // 현재 글 작성자
        	    boolean isWriter =
        	            i.getWriterId().equals(finalUserId);

        	    // 게시글 주인
        	    boolean isCommissionOwner =
        	            i.getCommission().getUserId().equals(finalUserId);

        	    // 부모 문의 작성자
        	    boolean isParentWriter = false;

        	    if (i.getParentId() != null) {

        	        Inquiry parent = inquiryRepository
        	                .findById(i.getParentId())
        	                .orElse(null);

        	        if (parent != null) {
        	            isParentWriter =
        	                    parent.getWriterId().equals(finalUserId);
        	        }
        	    }

        	    canView =
        	            isWriter ||
        	            isCommissionOwner ||
        	            isParentWriter;
        	}

            return InquiryResponse.builder()
                    .id(i.getId())
                    .writerId(canView ? i.getWriterId() : null)
                    .nickname(canView ? i.getWriter().getNickname() : null)
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

        Inquiry inquiry = inquiryRepository.findById(inquiryId)
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

        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new RuntimeException("문의 없음"));

        // 권한 체크 (작성자 or 게시글 주인)
        boolean isOwner = inquiry.getWriterId().equals(userId);
        boolean isCommissionOwner = inquiry.getCommission().getUserId().equals(userId);

        if (!isOwner && !isCommissionOwner) {
            throw new RuntimeException("삭제 권한 없음");
        }

        inquiryRepository.delete(inquiry);
    }
    
    @Transactional(readOnly = true)
    public List<InquiryResponse> getReceivedInquiries(Long userId) {

        return inquiryRepository
                .findReceivedInquiries(userId)
                .stream()
                .map(i -> InquiryResponse.builder()
                        .id(i.getId())
                        .writerId(i.getWriterId())
                        .nickname(
                            i.getWriter() != null
                            ? i.getWriter().getNickname()
                            : null
                        )
                        .content(i.getContent())
                        .isSecret(i.isSecret())
                        .parentId(i.getParentId())
                        .createdAt(i.getCreatedAt().toString())
                        .commissionId(i.getCommission().getId())
                        .build())
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<InquiryResponse> getMyInquiries(Long userId) {

    	return inquiryRepository
                .findByWriterIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(i -> {

                    boolean hasReply =
                            inquiryRepository.existsByParentId(i.getId());

                    return InquiryResponse.builder()
                            .id(i.getId())
                            .writerId(i.getWriterId())
                            .nickname(
                                i.getWriter() != null
                                ? i.getWriter().getNickname()
                                : null
                            )
                            .content(i.getContent())
                            .isSecret(i.isSecret())
                            .parentId(i.getParentId())
                            .createdAt(i.getCreatedAt().toString())
                            .commissionId(i.getCommission().getId())
                            .hasReply(hasReply)
                            .build();
                })
                .toList();
    }
}

