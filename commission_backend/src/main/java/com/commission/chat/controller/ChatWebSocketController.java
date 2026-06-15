package com.commission.chat.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.commission.chat.dto.ChatMessageRequest;
import com.commission.chat.dto.ChatMessageResponse;
import com.commission.chat.service.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
	
	private final ChatService chatService;
	private final SimpMessagingTemplate messagingTemplate;

	
	@MessageMapping("/chat.send")
	public void sendMessage(
	        ChatMessageRequest request
	) {
		System.out.println("메시지 수신: "
	            + request.getContent());

	    ChatMessageResponse response =
	            chatService.saveMessage(request);

	    messagingTemplate.convertAndSend(
	            "/topic/chat/" + request.getRoomId(),
	            response
	    );
	}

}
