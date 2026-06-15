package com.commission.chat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.chat.entity.ChatMessage;
import com.commission.chat.entity.ChatRoom;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
	
	List<ChatMessage> findByChatRoomIdOrderByCreatedAtAsc(Long roomId);
	
	List<ChatMessage> findByChatRoomOrderByCreatedAtAsc(
            ChatRoom chatRoom
    );
	
	long countByChatRoom_IdAndSender_IdNotAndIsReadFalse(
	        Long roomId,
	        Long userId
	);
	
	List<ChatMessage>
	findByChatRoomAndSender_IdNotAndIsReadFalse(
	        ChatRoom chatRoom,
	        Long userId
	);
}
