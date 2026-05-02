package com.commission.user.controller;
 
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.commission.common.file.FileService;
import com.commission.config.JwtUtil;
import com.commission.user.dto.LoginRequestDto;
import com.commission.user.dto.PasswordUpdateRequestDto;
import com.commission.user.dto.RegisterRequestDto;
import com.commission.user.dto.UserResponseDto;
import com.commission.user.dto.UserUpdateRequestDto;
import com.commission.user.entity.UserEntity;
import com.commission.user.repository.UserRepository;
import com.commission.user.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final FileService fileService;
	
	private final UserService userService;
	
	private final JwtUtil jwtUtil;
	
	private final UserRepository userRepository;
	
	@PostMapping("/register")
	 public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDto dto) {
		
        userService.register(dto);

	    log.info("회원가입 성공");
	    
	    return ResponseEntity.ok("회원가입 성공");
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
	    		user.getId(),
	            user.getUsername(),
	            user.getNickname(),
	            user.getRole().name()
	    );
	    
	    String refreshToken = jwtUtil.createRefreshToken(user.getId());
	    
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

	    // userId 기반으로 변경
	    Long userId = jwtUtil.getUserId(refreshToken);

	    UserEntity user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("유저 없음: " + userId));

	    String newAccessToken = jwtUtil.createToken(
	            user.getId(),
	            user.getUsername(),
	            user.getNickname(),
	            user.getRole().name()
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
	// 유저 정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(Authentication authentication) {
    	
    	if (authentication == null || !authentication.isAuthenticated()) {
    	    return ResponseEntity.status(401).body("로그인 필요");
    	}
        
        Long userId = (Long) authentication.getPrincipal();

        UserResponseDto response = userService.getMyInfo(userId);
        return ResponseEntity.ok(response);
    }
    
    // 유저 정보 수정
    @PatchMapping("/me")
    public ResponseEntity<?> updateUser(
            Authentication auth,	
            @RequestPart(value = "data") UserUpdateRequestDto dto,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) throws Exception {
    	
    	Long userId = (Long) auth.getPrincipal();

        String imageUrl = null;

        if (file != null) {
            imageUrl = fileService.saveFile(file, "profile");
        }

        userService.updateUser(userId, dto, imageUrl);

        return ResponseEntity.ok("수정 완료");
    }

    // 비밀번호 변경
    @PatchMapping("/password")
    public ResponseEntity<?> updatePassword(
            Authentication auth,
            @RequestBody PasswordUpdateRequestDto dto
    ) {
    	Long userId = (Long) auth.getPrincipal();

        userService.updatePassword(userId, dto);

        return ResponseEntity.ok("비밀번호 변경 완료");
    }

}
