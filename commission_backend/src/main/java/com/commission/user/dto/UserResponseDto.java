package com.commission.user.dto;

import com.commission.user.entity.UserEntity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDto {

    private String username;
    private String email;
    private String nickname;
    private String profileImage;
    private String bio;

    public static UserResponseDto from(UserEntity user) {
        return UserResponseDto.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .bio(user.getBio())
                .build();
    }
}