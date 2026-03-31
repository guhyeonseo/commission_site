package com.commission.controller;

import org.springframework.web.bind.annotation.PostMapping; 
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commission.entity.UserEntity;
import com.commission.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {
	
	private final UserService userService;
	
	@PostMapping("/register")
	public String register(@RequestBody UserEntity entity) {

	    userService.register(
	    		entity.getUsername(),
	    		entity.getNickname(),
	    		entity.getPassword(),
	    		entity.getEmail()
	    );

	    log.info("회원가입 성공");

	    return "회원가입 성공";
	}
    // 로그인
	@PostMapping("/login")
	public UserEntity login(@RequestBody UserEntity entity) {

	    log.info("로그인 성공");

	    return userService.login(
	        entity.getUsername(),
	        entity.getPassword()
	    );
	}
}
