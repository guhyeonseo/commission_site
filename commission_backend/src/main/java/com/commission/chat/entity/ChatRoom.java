package com.commission.chat.entity;

import java.time.LocalDateTime;

import com.commission.commission.entity.Commission;
import com.commission.user.entity.User;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder	
public class ChatRoom {
	
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "buyer_id")
	    private User buyer;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "seller_id")
	    private User seller;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "commission_id")
	    private Commission commission;

	    private LocalDateTime createdAt;

	    @PrePersist
	    public void prePersist() {
	        createdAt = LocalDateTime.now();
	    }

}
