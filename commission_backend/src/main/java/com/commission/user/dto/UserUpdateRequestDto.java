package com.commission.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequestDto {

    @NotBlank(message = "닉네임은 필수입니다.")
    private String nickname;

    private String bio;
}