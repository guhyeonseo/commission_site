package com.commission.commission.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InquiryResponse {

	private Long id;
    private Long writerId;
    private String content;
    private boolean isSecret;
    private boolean canView;
    private Long parentId;
    private String createdAt;
}
