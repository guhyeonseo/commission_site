package com.commission.controller;
 
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commission.config.JwtUtil;
import com.commission.domain.user.UserEntity;
import com.commission.dto.user.LoginRequestDto;
import com.commission.dto.user.RegisterRequestDto;
import com.commission.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
 
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
	
	private final UserService userService;
	
	private final JwtUtil jwtUtil;
	
	@PostMapping("/register")
	public String register(@RequestBody RegisterRequestDto dto) {
		
        userService.register(dto);

	    log.info("회원가입 성공");
	    
	    return "회원가입 성공";
	}
    // 로그인
	@PostMapping("/login")
	public Map<String, String> login(@RequestBody LoginRequestDto dto) {

	    UserEntity user = userService.login(
	    		dto.getUsername(),
	    		dto.getPassword()
	    );

	    String token = jwtUtil.createToken(
	    		user.getUsername(),
	    		user.getNickname(),
	    		user.getRole().name()
	    );
	    
	    log.info("로그인 성공");
	    return Map.of("token", token);
	}
	
	@GetMapping("/me")
	public Map<String, Object> me(Authentication auth) {
	    return Map.of(
	        "username", auth.getName(),
	        "role", auth.getAuthorities()
	    );
	}
}
