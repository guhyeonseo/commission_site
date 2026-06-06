package com.commission.commission.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.commission.commission.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long>{

	boolean existsByPayment_Id(Long paymentId);

	 @Query("""
			    SELECT AVG(r.rating)
			    FROM Review r
			    WHERE r.payment.commission.id = :commissionId
			""")
			Double getAvgRating(
			        @Param("commissionId")
			        Long commissionId
			);

	int countByPayment_Commission_Id(Long commissionId);
	    
    List<Review> findByPayment_Commission_IdOrderByIdDesc(
            Long commissionId
    );
    
    List<Review> findByWriterIdOrderByIdDesc(
            Long writerId
    );
}
