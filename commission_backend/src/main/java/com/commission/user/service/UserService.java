package com.commission.user.service;

import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.user.dto.PasswordUpdateRequestDto;
import com.commission.user.dto.RegisterRequestDto;
import com.commission.user.dto.UserResponseDto;
import com.commission.user.dto.UserUpdateRequestDto;
import com.commission.user.entity.UserEntity;
import com.commission.user.entity.UserRole;
import com.commission.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;

    // 회원가입
    public void register(RegisterRequestDto dto) {

        // 아이디 중복 체크
        if (userRepository.existsByUsername(dto.getUsername())) {
        	throw new IllegalArgumentException("이미 존재하는 아이디 입니다.");
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(dto.getEmail())) {
        	throw new IllegalArgumentException("이미 존재하는 이메일 입니다.");
        }

        UserEntity user = new UserEntity();
        user.setUsername(dto.getUsername());
        user.setNickname(dto.getNickname());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail());
        user.setRole(UserRole.USER);

        userRepository.save(user);
    }

    // 로그인
    public UserEntity login(String username, String password) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 아이디 입니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
        	throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return user;
    }
    
    // 유저 정보 조회
    public void updateUser(String username, UserUpdateRequestDto dto) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        user.setNickname(dto.getNickname());
        user.setBio(dto.getBio());
    }
    
    // 유저 정보 수정
    @Transactional(readOnly = true)
    public UserResponseDto getMyInfo(String username) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        return UserResponseDto.from(user);
    }
    
    public void updatePassword(String username, PasswordUpdateRequestDto dto) {

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("현재 비밀번호가 틀립니다.");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    }
    
    public Long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow()
                .getId();
    }
}
