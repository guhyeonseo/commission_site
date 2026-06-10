package com.commission.commission.dto;

import java.util.List; 

import com.commission.commission.entity.Commission;
import com.commission.commission.entity.CommissionStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CommissionResponseDto {

	private Long userId;
	private String nickname;
	
	private Long id;
    private String title;
    private String description; 
    private int price;           
    private int estimatedDays;   
    private String thumbnailUrl;
    private List<String> images;

    private CommissionStatus status;
    
	private Double avgRating;
	private Integer reviewCount;
	
	private Integer viewCount;
    
    public static CommissionResponseDto from(Commission c) {
        List<String> images = c.getImages()
                .stream()
                .map(img -> img.getImageUrl())
                .toList();

        return new CommissionResponseDto(
        		c.getUserId(),
        		null,

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
}
