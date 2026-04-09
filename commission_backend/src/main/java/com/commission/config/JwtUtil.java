package com.commission.config;

import java.security.Key; 
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {
	
	private final String SECRET = "my-secret-key-my-secret-key-my-secret-key";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    private final long expiration = 1000 * 60 * 60;
//    private final long expiration = 1000 * 20;
    
    public String createToken(String username, String nickname, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("nickname", nickname)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }
    
    private final long refreshExpiration = 1000L * 60 * 60 * 24 * 7;
    
    public String createRefreshToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(key)
                .compact();
    }

    public String getUsername(String token) {
        return parse(token).getSubject();
    }

    public String getRole(String token) {
        return parse(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            parse(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
