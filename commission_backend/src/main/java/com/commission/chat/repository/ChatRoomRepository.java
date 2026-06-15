package com.commission.chat.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.commission.chat.entity.ChatRoom;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

	Optional<ChatRoom>
	findByBuyerIdAndCommissionId(
			Long buyerId,
	        Long commissionId
	);
	
	List<ChatRoom> findByBuyerIdOrSellerId(
		    Long buyerId,
		    Long sellerId
	);
	
}
