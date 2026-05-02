package com.commission.commission.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "review")
public class ReviewEntity {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    // 주문 (1:1)
	    @OneToOne
	    @JoinColumn(name = "order_id", nullable = false, unique = true)
	    private OrderEntity order;

	    @Column(name = "writer_id", nullable = false)
	    private Long writerId;

	    @Column(nullable = false)
	    private Double rating;

	    @Column(columnDefinition = "TEXT")
	    private String content;

	    private LocalDateTime createdAt;
}
