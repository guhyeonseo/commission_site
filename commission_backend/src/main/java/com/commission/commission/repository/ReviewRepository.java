package com.commission.commission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.commission.commission.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{

	boolean existsByOrderId(Long orderId);

    @Query("SELECT AVG(r.rating) FROM Review  r WHERE r.order.commission.id = :commissionId")
    Double getAvgRating(Long commissionId);

    int countByOrder_Commission_Id(Long commissionId);
}
