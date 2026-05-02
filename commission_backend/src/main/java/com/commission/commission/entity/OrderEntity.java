package com.commission.commission.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "orders")
public class OrderEntity {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    // 커미션
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "commission_id", nullable = false)
	    private CommissionEntity commission;

	    // 구매자
	    @Column(name = "buyer_id", nullable = false)
	    private Long buyerId;

	    // 상태
	    @Column(length = 20)
	    private String status;

	    // 요청 내용
	    @Column(name = "request_detail", columnDefinition = "TEXT")
	    private String requestDetail;

	    // 생성일
	    @Column(name = "created_at", updatable = false)
	    private java.time.LocalDateTime createdAt;
}
