package com.commission.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}
	
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration config = new CorsConfiguration();

	    config.addAllowedOrigin("http://localhost:5173");
	    config.addAllowedMethod("*");
	    config.addAllowedHeader("*");
	    config.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);

	    return source;
	}
	
	
	@Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, JwtUtil jwtUtil) throws Exception {

	    http
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/api/user/login", "/api/user/signup").permitAll()
	            .anyRequest().authenticated()
	        )
	        .addFilterBefore(new JwtFilter(jwtUtil),
	                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}
}