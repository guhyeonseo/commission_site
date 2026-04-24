package com.commission.config;

import org.springframework.context.annotation.Bean; 
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

	 @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

	    @Bean
	    public JwtUtil jwtUtil() {
	        return new JwtUtil();
	    }

	    @Bean
	    public JwtFilter jwtFilter() {
	        return new JwtFilter(jwtUtil());
	    }

	    @Bean
	    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
	        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();

	        config.setAllowCredentials(true);

	        config.addAllowedOrigin("http://localhost:5173"); 
	        config.addAllowedHeader("*");
	        config.addAllowedMethod("*");

	        config.addExposedHeader("Authorization");

	        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
	                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

	        source.registerCorsConfiguration("/**", config);

	        return source;
	    }
	    
	    @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

	    	System.out.println("필터실행!!!!!!!!!!!!!@@@@@@@@@");
	    	
	        http
	        	.cors(cors -> cors.configurationSource(corsConfigurationSource()))
	            .csrf(csrf -> csrf.disable())
	            .authorizeHttpRequests(auth -> auth
	                .requestMatchers("/api/user/register", "/api/user/login").permitAll()
	                .requestMatchers("/api/user/me").authenticated()
	                .anyRequest().permitAll()
	            )
	            .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
}