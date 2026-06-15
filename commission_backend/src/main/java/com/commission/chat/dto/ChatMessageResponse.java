package com.commission.chat.dto;

import java.time.LocalDateTime;

import com.commission.chat.entity.ChatMessage;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatMessageResponse {
	
    private Long messageId;

    private Long roomId;

    private Long senderId;

    private String senderNickname;

    private String content;

    private LocalDateTime createdAt;

    public static ChatMessageResponse from(ChatMessage message) {

        return new ChatMessageResponse(
                message.getId(),
                message.getChatRoom().getId(),
                message.getSender().getId(),
                message.getSender().getNickname(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
}
