package com.commission.chat.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.commission.chat.dto.ChatMessageResponse;
import com.commission.chat.dto.ChatRoomResponse;
import com.commission.chat.entity.ChatMessage;
import com.commission.chat.entity.ChatRoom;
import com.commission.chat.repository.ChatMessageRepository;
import com.commission.chat.repository.ChatRoomRepository;
import com.commission.commission.entity.Commission;
import com.commission.commission.repository.CommissionRepository;
import com.commission.payment.entity.PaymentStatus;
import com.commission.payment.repository.PaymentRepository;
import com.commission.user.entity.User;
import com.commission.user.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatRoomService {

	private final ChatRoomRepository chatRoomRepository;
	private final ChatMessageRepository chatMessageRepository;
    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    
    public ChatRoomResponse createRoom(
            Long buyerId,
            Long commissionId
    ) {

    	User buyer =
    		    userRepository.findById(buyerId)
    		        .orElseThrow();
    	
        Commission commission =
        	    commissionRepository.findById(commissionId)
        	        .orElseThrow();
        
        if (commission.getUserId().equals(buyerId)) {
            throw new IllegalArgumentException(
                    "본인 커미션에는 채팅할 수 없습니다."
            );
        }
        
        boolean paid =
        	    paymentRepository
        	        .existsByBuyer_IdAndCommission_IdAndStatusIn(
        	            buyerId,
        	            commissionId,
        	            List.of(
        	                PaymentStatus.WAITING_START,
        	                PaymentStatus.IN_PROGRESS,
        	                PaymentStatus.WORK_DONE,
        	                PaymentStatus.COMPLETED
        	            )
        	        );

        	if (!paid) {

        	    throw new IllegalArgumentException(
        	        "결제 후 채팅 가능합니다."
        	    );
        	}

        Optional<ChatRoom> existing =
                chatRoomRepository
                        .findByBuyerIdAndCommissionId(
                        		buyerId,
                                commissionId
                        );

        if (existing.isPresent()) {

            ChatRoom room = existing.get();

            return new ChatRoomResponse(
                    room.getId(),
                    buyer.getId(),
                    room.getSeller().getId(),
                    commissionId,
                    commission.getTitle(),
                    room.getSeller().getNickname(),
                    0
            );
        }

        User seller =
                userRepository.findById(
                        commission.getUserId()
                ).orElseThrow();

        ChatRoom room =
                ChatRoom.builder()
                        .buyer(buyer)
                        .seller(seller)
                        .commission(commission)
                        .build();

        chatRoomRepository.save(room);

        return new ChatRoomResponse(
                room.getId(),
                buyer.getId(),
                room.getSeller().getId(),
                commissionId,
                commission.getTitle(),
                room.getSeller().getNickname(),
                0
        );
    }
    
    public List<ChatRoomResponse> getMyRooms(Long userId) {

    	return chatRoomRepository
                .findByBuyerIdOrSellerId(
                        userId,
                        userId
                )
                .stream()
                .map(room -> {

                    String otherUserNickname;

                    if (room.getBuyer().getId().equals(userId)) {

                        otherUserNickname =
                                room.getSeller()
                                        .getNickname();

                    } else {

                        otherUserNickname =
                                room.getBuyer()
                                        .getNickname();
                    }
                    
                    long unreadCount = chatMessageRepository
                            .countByChatRoom_IdAndSender_IdNotAndIsReadFalse(
                                    room.getId(),
                                    userId
                            );

                    return new ChatRoomResponse(
                            room.getId(),
                            room.getBuyer().getId(),
                            room.getSeller().getId(),
                            room.getCommission().getId(),
                            room.getCommission().getTitle(),
                            otherUserNickname,
                            unreadCount
                    );
                })
                .toList();
    }
    
    public List<ChatMessageResponse> enterRoom(
            Long roomId,
            Long userId
    ) {

    	System.out.println("채팅방 입장");
    	
        ChatRoom room = chatRoomRepository
                .findById(roomId)
                .orElseThrow(() ->
                        new IllegalArgumentException("채팅방이 없습니다."));

        if (!room.getBuyer().getId().equals(userId)
                && !room.getSeller().getId().equals(userId)) {

            throw new IllegalArgumentException("접근 권한이 없습니다.");
        }

        List<ChatMessage> unreadMessages =
                chatMessageRepository
                        .findByChatRoomAndSender_IdNotAndIsReadFalse(
                                room,
                                userId
                        );

        unreadMessages.forEach(
                ChatMessage::markAsRead
        );

        return chatMessageRepository
                .findByChatRoomOrderByCreatedAtAsc(room)
                .stream()
                .map(ChatMessageResponse::from)
                .toList();
    }
    
    public void markAsRead(
            Long roomId,
            Long userId
    ) {

        ChatRoom room =
                chatRoomRepository.findById(roomId)
                        .orElseThrow();

        List<ChatMessage> unreadMessages =
                chatMessageRepository
                        .findByChatRoomAndSender_IdNotAndIsReadFalse(
                                room,
                                userId
                        );

        System.out.println(
                "읽음 처리 대상 = "
                + unreadMessages.size()
        );

        unreadMessages.forEach(
                ChatMessage::markAsRead
        );

        chatMessageRepository.saveAll(
                unreadMessages
        );
    }
}
