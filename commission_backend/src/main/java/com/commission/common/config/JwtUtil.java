package com.commission.common.config;

import java.security.Key; 
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final Key key;

    private final long expiration = 1000 * 60 * 60; // 1시간

    public JwtUtil(
            @Value("${jwt.secret}") String secret
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Access Token 생성
    public String createToken(
            Long userId,
            String username,
            String nickname,
            String role
    ) {

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("username", username)
                .claim("nickname", nickname)
                .claim("role", role)
                .claim("type", "access")
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis() + expiration
                        )
                )
                .signWith(key)
                .compact();
    }

    // Refresh Token 생성
    public String createRefreshToken(Long userId) {

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("type", "refresh")
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60 * 24 * 7
                        )
                )
                .signWith(key)
                .compact();
    }

    // Claims 추출
    public Claims parseClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    public String getUsername(String token) {
        return parseClaims(token)
                .get("username", String.class);
    }

    public String getRole(String token) {
        return parseClaims(token)
                .get("role", String.class);
    }

    public boolean validateToken(String token) {

        try {

            parseClaims(token);
            return true;

        } catch (Exception e) {

            return false;

        }
    }

    public boolean isRefreshToken(String token) {

        return "refresh".equals(
                parseClaims(token)
                        .get("type")
        );
    }

    public boolean isAccessToken(String token) {

        return "access".equals(
                parseClaims(token)
                        .get("type")
        );
    }
}