package com.commission.commission.service;

import java.util.ArrayList; 
import java.util.List;

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

	        return CommissionResponseDto.from(repository.save(c));
	    }

	    // 상세 + 조회수 증가
	    public CommissionResponseDto findById(Long id) {
	        Commission c = repository.findById(id)
	                .orElseThrow(() -> new RuntimeException("없음"));

	        c.setViewCount(c.getViewCount() + 1);

	        return CommissionResponseDto.from(c);
	    }

	    // 수정 (이미지는 일단 제외)
	    public CommissionResponseDto update(Long id, CommissionUpdateDto dto) {
	        Commission c = repository.findById(id)
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
	    
	    public List<CommissionResponseDto> search(CommissionSearchDto cond) {
	        return repository.search(cond)
	                .stream()
	                .map(CommissionResponseDto::from)
	                .toList();
	    }
	    
	    @Transactional(readOnly = true)
	    public List<CommissionResponseDto>
	    getMyCommissions(Long userId) {

	        return repository
	                .findByUserId(userId)
	                .stream()
	                .map(CommissionResponseDto::from)
	                .toList();
	    }
	    
}
