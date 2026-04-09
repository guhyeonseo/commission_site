package com.commission.config;

import org.springframework.context.annotation.Bean; 
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
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

	    config.setAllowCredentials(true);

	    config.addAllowedOriginPattern("*"); 
	    config.addAllowedHeader("*");
	    config.addAllowedMethod("*");

	    config.addExposedHeader("Authorization"); 

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
	    	.cors(cors -> {})
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	        		.requestMatchers("/api/user/register", "/api/user/login").permitAll()
//	        	    .anyRequest().authenticated()
//					테스트용 전역 허용
	        		.anyRequest().permitAll()
	        )
	        .addFilterBefore(new JwtFilter(jwtUtil),
	        		UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}
}