package com.commission.commission.dto;

import com.commission.commission.entity.Inquiry;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InquiryResponse {

	private Long id;
    private Long writerId;
    private String nickname;
    private String content;
    private boolean isSecret;
    private boolean canView;
    private Long parentId;
    private String createdAt;
    private Double avgRating;
    private Integer reviewCount;
    
    private Long commissionId;
    
    private Boolean hasReply;
    
    public static InquiryResponse from(Inquiry inquiry) {

        return InquiryResponse.builder()
                .id(inquiry.getId())
                .writerId(inquiry.getWriterId())
                .nickname(
                        inquiry.getWriter() != null
                                ? inquiry.getWriter().getNickname()
                                : null
                )
                .content(inquiry.getContent())
                .isSecret(inquiry.isSecret())
                .canView(true)
                .parentId(inquiry.getParentId())
                .createdAt(inquiry.getCreatedAt().toString())
                .build();
    }
}
