package com.commission.config;

import java.security.Key; 
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {
	
	private final Key key = Keys.hmacShaKeyFor("your-secret-key-your-secret-key-1234".getBytes());
    private final long expiration = 1000 * 60 * 60; // 1시간

    // 토큰 생성
    public String createToken(Long userId, String username, String nickname, String role) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // ⭐ userId
                .claim("username", username)
                .claim("nickname", nickname)
                .claim("role", role)
                .claim("type", "access")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    // Claims 파싱
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ⭐ userId 꺼내기 (핵심)
    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    public String getUsername(String token) {
        return parseClaims(token).get("username", String.class);
    }

    public String getRole(String token) {
        return parseClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public String createRefreshToken(Long userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId)) // userId 기반
                .claim("type", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7일
                .signWith(key)
                .compact();
    }
    
    public boolean isRefreshToken(String token) {
        return "refresh".equals(parseClaims(token).get("type"));
    }
    
    public boolean isAccessToken(String token) {
        return "access".equals(parseClaims(token).get("type"));
    }
}
