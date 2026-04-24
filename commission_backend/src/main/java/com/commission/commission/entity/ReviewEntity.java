package com.commission.commission.entity;

import java.time.LocalDateTime;

import com.mysql.cj.x.protobuf.MysqlxCrud.Order;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "review")
public class ReviewEntity {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    // 주문 (1:1)
	    @OneToOne
	    @JoinColumn(name = "order_id", nullable = false, unique = true)
	    private Order order;

	    @Column(name = "writer_id", nullable = false)
	    private Long writerId;

	    @Column(nullable = false)
	    private Double rating;

	    @Column(columnDefinition = "TEXT")
	    private String content;

	    private LocalDateTime createdAt;
}
