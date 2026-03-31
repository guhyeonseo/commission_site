package com.commission.entity;

import java.time.LocalDateTime;  

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name="users")
public class UserEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String username;
	private String nickname;
	private String password;
	private String email;
	
	@Column(nullable = false)
	private String role; //USER / ADMIN
	
	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
	    this.createdAt = LocalDateTime.now();
	}
}
