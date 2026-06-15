package com.commission.chat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.commission.chat.dto.ChatMessageRequest;
import com.commission.chat.dto.ChatMessageResponse;
import com.commission.chat.entity.ChatMessage;
import com.commission.chat.entity.ChatRoom;
import com.commission.chat.repository.ChatMessageRepository;
import com.commission.chat.repository.ChatRoomRepository;
import com.commission.user.entity.User;
import com.commission.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {
	
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    
    public ChatMessageResponse saveMessage(
            ChatMessageRequest request
    ) {

        ChatRoom room =
                chatRoomRepository.findById(
                        request.getRoomId()
                ).orElseThrow();

        User sender =
                userRepository.findById(
                        request.getSenderId()
                ).orElseThrow();

        ChatMessage message =
                ChatMessage.builder()
                        .chatRoom(room)
                        .sender(sender)
                        .content(request.getContent())
                        .build();

        chatMessageRepository.save(message);

        return new ChatMessageResponse(
                message.getId(),
                room.getId(),
                sender.getId(),
                sender.getNickname(),
                message.getContent(),
                message.getCreatedAt()
        );
    }
    
    public List<ChatMessageResponse> getMessages(
            Long roomId) {

        return chatMessageRepository
                .findByChatRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(ChatMessageResponse::from)
                .toList();
    }

}
