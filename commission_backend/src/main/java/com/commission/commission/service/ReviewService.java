package com.commission.commission.service;

import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.commission.dto.ReviewRequest;
import com.commission.commission.entity.CommissionEntity;
import com.commission.commission.entity.OrderEntity;
import com.commission.commission.entity.ReviewEntity;
import com.commission.commission.repository.CommissionRepository;
import com.commission.commission.repository.OrderRepository;
import com.commission.commission.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final CommissionRepository commissionRepository;

    /**
     * 리뷰 작성
     */
    @Transactional
    public void createReview(ReviewRequest dto, Long userId) {

        // 1. 주문 조회
        OrderEntity order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("주문 없음"));

        // 2. 본인 주문인지 체크 (null-safe)
        if (!Objects.equals(order.getBuyerId(), userId)) {
            throw new RuntimeException("권한 없음");
        }

        // 3. 거래 완료인지 체크
        if (!"COMPLETED".equals(order.getStatus())) {
            throw new RuntimeException("완료된 거래만 리뷰 가능");
        }

        // 4. 중복 리뷰 체크
        if (reviewRepository.existsByOrderId(order.getId())) {
            throw new RuntimeException("이미 리뷰 작성됨");
        }

        // 5. 평점 검증 (0 ~ 5, 0.5 단위)
        double rating = dto.getRating();
        if (rating < 0 || rating > 5 || Math.round(rating * 2) != rating * 2) {
            throw new RuntimeException("평점은 0~5 사이, 0.5 단위만 가능");
        }

        // 6. 리뷰 저장
        ReviewEntity review = ReviewEntity.builder()
                .order(order)
                .writerId(userId)
                .rating(rating)
                .content(dto.getContent())
                .build();

        reviewRepository.save(review);

        // 7. 커미션 평점 갱신
        updateCommissionRating(order.getCommission());
    }

    /**
     * 커미션 평균 평점 갱신
     */
    private void updateCommissionRating(CommissionEntity commission) {

        Double avg = reviewRepository.getAvgRating(commission.getId());
        int count = reviewRepository.countByOrder_Commission_Id(commission.getId());

        commission.setAvgRating(avg != null ? avg : 0.0);
        commission.setReviewCount(count);
    }
}