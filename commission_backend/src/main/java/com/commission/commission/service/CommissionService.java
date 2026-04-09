package com.commission.commission.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.commission.commission.dto.CommissionCreateDto;
import com.commission.commission.dto.CommissionResponseDto;
import com.commission.commission.dto.CommissionUpdateDto;
import com.commission.commission.entity.CommissionEntity;
import com.commission.commission.entity.commissionImageEntity;
import com.commission.commission.repository.CommissionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CommissionService {

	 private final CommissionRepository repository;

	    // 생성 
	    public CommissionResponseDto create(
	            Long userId,
	            CommissionCreateDto dto,
	            List<String> imageUrls,
	            Integer thumbnailIndex
	    ) {

	        CommissionEntity c = new CommissionEntity();

	        c.setUserId(userId);
	        c.setTitle(dto.getTitle());
	        c.setDescription(dto.getDescription());
	        c.setPrice(dto.getPrice());
	        c.setEstimatedDays(dto.getEstimatedDays());
	        c.setCategory(dto.getCategory());
	        c.setStatus("OPEN");

	        List<commissionImageEntity> imageList = new ArrayList<>();

	        if (imageUrls != null && !imageUrls.isEmpty()) {
	            for (String url : imageUrls) {
	                commissionImageEntity img = new commissionImageEntity();
	                img.setImageUrl(url);
	                img.setCommission(c);
	                imageList.add(img);
	            }
	        }

	        c.setImages(imageList);

	        // 썸네일 설정
	        if (!imageList.isEmpty()) {
	            if (thumbnailIndex != null && thumbnailIndex < imageList.size()) {
	                c.setThumbnailUrl(imageList.get(thumbnailIndex).getImageUrl());
	            } else {
	                c.setThumbnailUrl(imageList.get(0).getImageUrl());
	            }
	        }

	        return CommissionResponseDto.from(repository.save(c));
	    }

	    // 목록
	    public List<CommissionResponseDto> getList() {
	        return repository.findAll()
	                .stream()
	                .map(CommissionResponseDto::from)
	                .toList();
	    }

	    // 상세 + 조회수 증가
	    public CommissionResponseDto findById(Long id) {
	        CommissionEntity c = repository.findById(id)
	                .orElseThrow(() -> new RuntimeException("없음"));

	        c.setViewCount(c.getViewCount() + 1);

	        return CommissionResponseDto.from(c);
	    }

	    // 수정 (이미지는 일단 제외)
	    public CommissionResponseDto update(Long id, CommissionUpdateDto dto) {
	        CommissionEntity c = repository.findById(id)
	                .orElseThrow(() -> new RuntimeException("없음"));

	        c.setTitle(dto.getTitle());
	        c.setDescription(dto.getDescription());
	        c.setPrice(dto.getPrice());
	        c.setEstimatedDays(dto.getEstimatedDays());
	        c.setCategory(dto.getCategory());

	        return CommissionResponseDto.from(c);
	    }

	    // 삭제
	    public void delete(Long id) {
	        repository.deleteById(id);
	    }
}
