package com.commission.user.service;

import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;

import com.commission.user.dto.RegisterRequestDto;
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
            throw new RuntimeException("이미 존재하는 아이디 입니다.");
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일 입니다.");
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
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디 입니다."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("비밀번호 틀림");
        }

        return user;
    }
    
    public Long getUserIdByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow()
                .getId();
    }
}
