package com.commission.user.repository;

import java.util.Optional; 

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.user.entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>{

    // 아이디 중복 체크
    boolean existsByUsername(String username);

    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 로그인용 (아이디 찾기)
    Optional<UserEntity> findByUsername(String username);
}
