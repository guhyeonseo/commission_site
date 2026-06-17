package com.commission.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.commission.admin.dto.AdminUserResponseDto;
import com.commission.admin.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDto>> getUsers() {
        return ResponseEntity.ok(adminService.getUsers());
    }
    
    @PatchMapping("/users/{userId}/suspend")
    public ResponseEntity<Void> suspendUser(
            @PathVariable("userId") Long userId
    ) {

        adminService.suspendUser(userId);

        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/users/{userId}/activate")
    public ResponseEntity<Void> activateUser(
            @PathVariable("userId") Long userId
    ) {

        adminService.activateUser(userId);

        return ResponseEntity.ok().build();
    }
}