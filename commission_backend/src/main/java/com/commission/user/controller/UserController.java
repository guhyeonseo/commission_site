package com.commission.user.controller;
 
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commission.config.JwtUtil;
import com.commission.user.dto.LoginRequestDto;
import com.commission.user.dto.RegisterRequestDto;
import com.commission.user.entity.UserEntity;
import com.commission.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
	public ResponseEntity<Map<String, String>> login(
	        @RequestBody LoginRequestDto dto,
	        HttpServletResponse response
	) {

	    UserEntity user = userService.login(
	    		dto.getUsername(),
	    		dto.getPassword()
	    );

	    String accessToken = jwtUtil.createToken(
	            user.getUsername(),
	            user.getNickname(),
	            user.getRole().name()
	    );
	    
	    String refreshToken = jwtUtil.createRefreshToken(user.getUsername());
	    
	    Cookie cookie = new Cookie("refreshToken", refreshToken);
	    cookie.setHttpOnly(true);
	    cookie.setPath("/");
	    cookie.setMaxAge(7 * 24 * 60 * 60);
	    
	    log.info("로그인 성공");
	    
	    response.addCookie(cookie);

	    return ResponseEntity.ok(Map.of("accessToken", accessToken));
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<Map<String, String>> refresh(HttpServletRequest request) {

	    String refreshToken = null;

	    if (request.getCookies() != null) {
	        for (Cookie c : request.getCookies()) {
	            if (c.getName().equals("refreshToken")) {
	                refreshToken = c.getValue();
	            }
	        }
	    }

	    if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
	        return ResponseEntity.status(401).build();
	    }
	    
	    String username = jwtUtil.getUsername(refreshToken);

	    String newAccessToken = jwtUtil.createToken(
	            username,
	            "", // nickname 필요 없으면 빈값
	            "USER" // 나중에 DB에서 꺼내도 됨
	    );

	    return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	}
	
	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpServletResponse response) {

	    Cookie cookie = new Cookie("refreshToken", null);
	    cookie.setMaxAge(0);
	    cookie.setPath("/");

	    response.addCookie(cookie);

	    return ResponseEntity.ok().build();
	}
	
	@GetMapping("/me")
	public Map<String, Object> me(Authentication auth) {
	    return Map.of(
	        "username", auth.getName(),
	        "role", auth.getAuthorities()
	    );
	}
}
