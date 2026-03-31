package com.commission.service;

import org.springframework.security.crypto.password.PasswordEncoder; 
import org.springframework.stereotype.Service;

import com.commission.entity.UserEntity;
import com.commission.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	
	private final PasswordEncoder passwordEncoder;

    // 회원가입
    public void register(String username, String nickname, String password, String email) {

        // 아이디 중복 체크
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("이미 존재하는 아이디 입니다.");
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("이미 존재하는 이메일 입니다.");
        }

        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setNickname(nickname);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole("USER");

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
}
