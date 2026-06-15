package com.commission.chat.dto;

import com.commission.chat.entity.ChatRoom;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChatRoomResponse {
	
    private Long roomId;

    private Long buyerId;

    private Long sellerId;

    private Long commissionId;
    
    private String commissionTitle;

    private String otherUserNickname;
    
    private long unreadCount;

//    public static ChatRoomResponse from(
//            ChatRoom room,
//            String otherUserNickname
//    ) {
//
//        return new ChatRoomResponse(
//                room.getId(),
//                room.getBuyer().getId(),
//                room.getSeller().getId(),
//                room.getCommission().getId(),
//                room.getCommission().getTitle(),
//                otherUserNickname
//        );
//    }
}
