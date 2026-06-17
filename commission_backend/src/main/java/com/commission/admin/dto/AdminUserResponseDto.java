package com.commission.admin.dto;

import com.commission.user.entity.UserRole;
import com.commission.user.entity.UserStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUserResponseDto {

    private Long userId;
    private String username;
    private String nickname;
    private String email;
    private UserStatus status;
    private UserRole role;
}
