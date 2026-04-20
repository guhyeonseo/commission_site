package com.commission.commission.dto;

import java.util.List; 

import com.commission.commission.entity.CommissionEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommissionResponseDto {

	private Long id;
    private String title;
    private String description; 
    private int price;           
    private int estimatedDays;   
    private String thumbnailUrl;
    private List<String> images;

    public static CommissionResponseDto from(CommissionEntity c) {
        List<String> images = c.getImages()
                .stream()
                .map(img -> img.getImageUrl())
                .toList();

        return new CommissionResponseDto(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.getPrice(),      
                c.getEstimatedDays(),
                c.getThumbnailUrl(),
                images
        );
    }
}
