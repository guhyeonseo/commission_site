package com.commission.commission.service;

import java.util.ArrayList; 
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.commission.dto.CommissionCreateDto;
import com.commission.commission.dto.CommissionResponseDto;
import com.commission.commission.dto.CommissionSearchDto;
import com.commission.commission.dto.CommissionUpdateDto;
import com.commission.commission.entity.Commission;
import com.commission.commission.entity.CommissionImage;
import com.commission.commission.entity.CommissionStatus;
import com.commission.commission.repository.CommissionRepository;
import com.commission.commission.repository.InquiryRepository;
import com.commission.common.file.FileService;
import com.commission.payment.entity.PaymentStatus;
import com.commission.payment.repository.PaymentRepository;
import com.commission.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionService {

	 private final CommissionRepository commissionRepository;
	 private final PaymentRepository paymentRepository;
	 private final InquiryRepository inquiryRepository;
	 private final FileService fileService;
	 private final UserRepository userRepository;

	    // 생성 
	    public CommissionResponseDto create(
	            Long userId,
	            CommissionCreateDto dto,
	            List<String> imageUrls,
	            Integer thumbnailIndex
	    ) {

	        Commission c = new Commission();

	        c.setUserId(userId);
	        c.setTitle(dto.getTitle());
	        c.setDescription(dto.getDescription());
	        c.setPrice(dto.getPrice());
	        c.setEstimatedDays(dto.getEstimatedDays());
	        c.setCategory(dto.getCategory());
	        c.setStatus(CommissionStatus.OPEN);

	        List<CommissionImage> imageList = new ArrayList<>();

	        if (imageUrls != null && !imageUrls.isEmpty()) {
	            for (String url : imageUrls) {
	                CommissionImage img = new CommissionImage();
	                img.setImageUrl(url);

	                img.setCommission(c);
	                imageList.add(img);
	            }
	        }

	        c.setImages(imageList);

	        int index = 0;

	        if (thumbnailIndex != null) {
	            index = thumbnailIndex;
	        }

	        // 범위 강제 보정
	        if (index < 0 || index >= imageList.size()) {
	            index = 0;
	        }

	        if (!imageList.isEmpty()) {
	            c.setThumbnailUrl(imageList.get(index).getImageUrl());
	        }

	        return CommissionResponseDto.from(commissionRepository.save(c));
	    }

	    // 상세 + 조회수 증가
	    public CommissionResponseDto findById(Long id) {
	        Commission c = commissionRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("없음"));
	        
	        if (c.getStatus()
	                == CommissionStatus.DELETED) {

	            throw new RuntimeException(
	                    "삭제된 커미션"
	            );
	        }

	        c.setViewCount(c.getViewCount() + 1);

	        String nickname = userRepository
	                .findById(c.getUserId())
	                .orElseThrow(() -> new RuntimeException("사용자 없음"))
	                .getNickname();

	        List<String> images = c.getImages()
	                .stream()
	                .map(img -> img.getImageUrl())
	                .toList();

	        return new CommissionResponseDto(
	                c.getUserId(),
	                nickname,

	                c.getId(),
	                c.getTitle(),
	                c.getDescription(),
	                c.getPrice(),
	                c.getEstimatedDays(),
	                c.getThumbnailUrl(),
	                images,
	                c.getStatus(),
	                c.getAvgRating(),
	                c.getReviewCount(),
	                c.getViewCount()
	        );
	    }

	    // 수정 (이미지는 일단 제외)
	    public CommissionResponseDto update(Long id, CommissionUpdateDto dto) {
	        Commission c = commissionRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("없음"));

	        c.setTitle(dto.getTitle());
	        c.setDescription(dto.getDescription());
	        c.setPrice(dto.getPrice());
	        c.setEstimatedDays(dto.getEstimatedDays());
	        c.setCategory(dto.getCategory());

	        return CommissionResponseDto.from(c);
	    }

	    // 삭제
	    @Transactional
	    public void deleteCommission(
	            Long commissionId,
	            Long userId,
	            String role
	    ) {

	        Commission commission =
	                commissionRepository
	                .findById(commissionId)
	                .orElseThrow();

	        boolean isOwner =
	                commission.getUserId()
	                        .equals(userId);

	        boolean isAdmin =
	                "ROLE_ADMIN".equals(role);

	        if (!isOwner && !isAdmin) {

	            throw new RuntimeException(
	                    "권한 없음"
	            );
	        }
	        boolean hasActivePayment =
	                paymentRepository
	                .existsByCommission_IdAndStatusIn(
	                        commissionId,
	                        List.of(
	                                PaymentStatus.READY,
	                                PaymentStatus.IN_PROGRESS
	                        )
	                );

	        if (hasActivePayment) {

	            throw new RuntimeException(
	                    "진행중인 주문이 있습니다."
	            );
	        }

	        boolean hasPayment =
	                paymentRepository
	                .existsByCommission_Id(
	                        commissionId
	                );

	        if (hasPayment) {

	            commission.setStatus(
	                    CommissionStatus.DELETED
	            );

	            return;
	        }

	        inquiryRepository
	                .deleteByCommission_Id(
	                        commissionId
	                );

	        fileService.deleteFile(
	                commission.getThumbnailUrl()
	        );

	        commissionRepository.delete(
	                commission
	        );
	    }
	    
	    @Transactional(readOnly = true)
	    public List<CommissionResponseDto>
	    getMyCommissions(Long userId) {

	        return commissionRepository
	                .findByUserIdAndStatusNot(
	                        userId,
	                        CommissionStatus.DELETED
	                )
	                .stream()
	                .map(CommissionResponseDto::from)
	                .toList();
	    }
	    
	    @Transactional(readOnly = true)
	    public Page<CommissionResponseDto> search(
	            CommissionSearchDto cond,
	            Pageable pageable
	    ) {

	        return commissionRepository
	                .search(cond, pageable)
	                .map(CommissionResponseDto::from);
	    }
	    
	    public void toggleStatus(
	            Long commissionId,
	            Long userId
	    ) {

	        Commission commission =
	                commissionRepository
	                .findById(commissionId)
	                .orElseThrow();

	        if (!commission.getUserId().equals(userId)) {
	            throw new RuntimeException("권한 없음");
	        }

	        if (commission.getStatus() == CommissionStatus.OPEN) {
	            commission.setStatus(
	                    CommissionStatus.CLOSED
	            );
	        } else if (commission.getStatus() == CommissionStatus.CLOSED) {
	            commission.setStatus(
	                    CommissionStatus.OPEN
	            );
	        }
	    }
	    
	    @Transactional(readOnly = true)
	    public List<CommissionResponseDto> getSellerCommissions(Long userId) {

	        return commissionRepository
	                .findByUserIdAndStatusNot(
	                        userId,
	                        CommissionStatus.DELETED
	                )
	                .stream()
	                .map(CommissionResponseDto::from)
	                .toList();
	    }
}
