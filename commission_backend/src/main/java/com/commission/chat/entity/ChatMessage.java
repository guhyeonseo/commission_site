package com.commission.chat.entity;

import java.time.LocalDateTime;

import com.commission.user.entity.User;

import jakarta.persistence.Column;
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
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "chat_room_id")
	    private ChatRoom chatRoom;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "sender_id")
	    private User sender;

	    @Column(nullable = false)
	    private String content;
	    
	    @Column(nullable = false)
	    @Builder.Default
	    private boolean isRead = false;

	    private LocalDateTime createdAt;

	    @PrePersist
	    public void prePersist() {
	        createdAt = LocalDateTime.now();
	    }
	    
	    public void markAsRead() {
	        this.isRead = true;
	    }
}
