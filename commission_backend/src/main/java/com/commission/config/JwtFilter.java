package com.commission.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter{
	
	 private final JwtUtil jwtUtil;

	    public JwtFilter(JwtUtil jwtUtil) {
	        this.jwtUtil = jwtUtil;
	    }

	    @Override
	    protected void doFilterInternal(HttpServletRequest request,
	                                    HttpServletResponse response,
	                                    FilterChain filterChain)
	            throws ServletException, IOException {

	        String uri = request.getRequestURI();
	        System.out.println("🔥 JWT 필터 진입: " + uri);

	        if (uri.startsWith("/uploads")) {
	        	SecurityContextHolder.clearContext(); 
	            filterChain.doFilter(request, response);
	            return;
	        }
	        
	        // ⭐ 필터 제외
	        if (uri.contains("/login") ||
	            uri.contains("/register") ||
	            uri.contains("/refresh")) {

	            filterChain.doFilter(request, response);
	            return;
	        }

	        if (request.getMethod().equals("OPTIONS")) {
	            filterChain.doFilter(request, response);
	            return;
	        }

	        String header = request.getHeader("Authorization");
	        System.out.println("Authorization: " + header);

	        if (header == null || !header.startsWith("Bearer ")) {
	            filterChain.doFilter(request, response);
	            return;
	        }

	        String token = header.substring(7);

	        if (!jwtUtil.validateToken(token) || !jwtUtil.isAccessToken(token)) {
	            SecurityContextHolder.clearContext();
	            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	            return;
	        }

	        Long userId = jwtUtil.getUserId(token);
	        String role = jwtUtil.getRole(token);

	        UsernamePasswordAuthenticationToken auth =
	                new UsernamePasswordAuthenticationToken(
	                        userId,
	                        null,
	                        List.of(new SimpleGrantedAuthority("ROLE_" + role))
	                );

	        SecurityContextHolder.getContext().setAuthentication(auth);

	        filterChain.doFilter(request, response);
	    }
}
