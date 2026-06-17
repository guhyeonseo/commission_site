package com.commission.admin.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.admin.dto.AdminUserResponseDto;
import com.commission.user.dto.UserResponseDto;
import com.commission.user.entity.User;
import com.commission.user.entity.UserStatus;
import com.commission.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<AdminUserResponseDto> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> AdminUserResponseDto.builder()
                        .userId(user.getId())
                        .username(user.getUsername())
                        .nickname(user.getNickname())
                        .email(user.getEmail())
                        .status(user.getStatus())
                        .role(user.getRole())
                        .build())
                .toList();
    }
    
    @Transactional
    public void suspendUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        user.setStatus(UserStatus.SUSPENDED);
    }
    
    @Transactional
    public void activateUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        user.setStatus(UserStatus.ACTIVE);
    }
    
}