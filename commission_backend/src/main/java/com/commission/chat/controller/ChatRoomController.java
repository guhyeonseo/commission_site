package com.commission.chat.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.commission.chat.dto.ChatMessageResponse;
import com.commission.chat.dto.ChatRoomCreateRequest;
import com.commission.chat.dto.ChatRoomResponse;
import com.commission.chat.service.ChatRoomService;
import com.commission.chat.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat-rooms")
public class ChatRoomController {
	
	 private final ChatRoomService chatRoomService;
	 private final ChatService chatService;
	 
	 @PostMapping
	 public ResponseEntity<ChatRoomResponse>
	 createRoom(
	         Authentication authentication,
	         @RequestBody ChatRoomCreateRequest request
	 ) {

	     Long userId =
	             (Long) authentication.getPrincipal();

	     return ResponseEntity.ok(
	             chatRoomService.createRoom(
	                     userId,
	                     request.getCommissionId()
	             )
	     );
	 }
	 
	 @GetMapping("/{roomId}/messages")
	    public ResponseEntity<List<ChatMessageResponse>>
	    getMessages(
	    		Authentication authentication,
	            @PathVariable("roomId") Long roomId
	    ) {
		 
		 Long userId =
		            (Long) authentication.getPrincipal();

		 return ResponseEntity.ok(
		            chatRoomService.enterRoom(
		                    roomId,
		                    userId
		            )
		    );
	    }
	 
	 @GetMapping("/my")
	 public ResponseEntity<List<ChatRoomResponse>>
	 getMyRooms(
	         Authentication authentication
	 ) {

	     System.out.println("authentication = " + authentication);

	     Long userId =
	             (Long) authentication.getPrincipal();

	     return ResponseEntity.ok(
	             chatRoomService.getMyRooms(userId)
	     );
	 }
	 
	 @PostMapping("/{roomId}/read")
	 public void markAsRead(
	         Authentication authentication,
	         @PathVariable("roomId") Long roomId
	 ) {

	     Long userId =
	             (Long) authentication.getPrincipal();

	     chatRoomService.markAsRead(
	             roomId,
	             userId
	     );
	     System.out.println("읽음 처리 실행");
	     System.out.println("roomId = " + roomId);
	     System.out.println("userId = " + userId);
	 }
	
}
