package com.commission.commission.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commission.commission.dto.ReviewRequest;
import com.commission.commission.dto.ReviewResponse;
import com.commission.commission.entity.Commission;
import com.commission.commission.entity.Review;
import com.commission.commission.repository.CommissionRepository;
import com.commission.commission.repository.ReviewRepository;
import com.commission.payment.entity.Payment;
import com.commission.payment.entity.PaymentStatus;
import com.commission.payment.repository.PaymentRepository;
import com.commission.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

	private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;

    /**
     * 리뷰 작성
     */
    @Transactional
    public void createReview(ReviewRequest dto, Long userId) {

        // 1. 주문 조회
    	Payment payment = paymentRepository.findById(dto.getPaymentId())
                .orElseThrow(() -> new RuntimeException("주문 없음"));

		System.out.println("payment.id = " + payment.getId());
		System.out.println("buyer = " + payment.getBuyer().getId());
		System.out.println("login = " + userId);
		    	
        // 2. 본인 주문인지 체크 (null-safe)
    	if (!Objects.equals(
                payment.getBuyer().getId(),
                userId
        )) {
            throw new RuntimeException("권한 없음");
        }

        // 3. 거래 완료인지 체크
    	if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("완료된 거래만 리뷰 가능");
        }

        // 4. 중복 리뷰 체크
    	if (reviewRepository.existsByPayment_Id(payment.getId())) {
            throw new RuntimeException("이미 리뷰 작성됨");
        }


        // 5. 평점 검증 (0 ~ 5, 0.5 단위)
    	double rating = dto.getRating();

        if (rating < 0
                || rating > 5
                || Math.round(rating * 2) != rating * 2) {

            throw new RuntimeException(
                    "평점은 0~5 사이, 0.5 단위만 가능"
            );
        }

        // 6. 리뷰 저장
        Review review = Review.builder()
                .payment(payment)
                .writerId(userId)
                .rating(rating)
                .content(dto.getContent())
                .build();

        reviewRepository.save(review);

        // 커미션 평점 갱신
        updateCommissionRating(
                payment.getCommission()
        );
    }
    
    private void updateCommissionRating(
            Commission commission
    ) {

        Double avg =
                reviewRepository.getAvgRating(
                        commission.getId()
                );

        int count =
                reviewRepository
                        .countByPayment_Commission_Id(
                                commission.getId()
                        );

        commission.setAvgRating(
                avg != null ? avg : 0.0
        );

        commission.setReviewCount(
                count
        );
    }
    
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviews(
            Long commissionId
    ) {
        return reviewRepository
                .findByPayment_Commission_IdOrderByIdDesc(
                        commissionId
                )
                .stream()
                .map(review -> {

                    String nickname =
                            userRepository.findById(review.getWriterId())
                                    .orElseThrow()
                                    .getNickname();

                    ReviewResponse response =
                            ReviewResponse.builder()
                                    .id(review.getId())
                                    .writerId(review.getWriterId())
                                    .writerNickname(nickname)
                                    .rating(review.getRating())
                                    .content(review.getContent())
                                    .createdAt(
                                            review.getCreatedAt()
                                                  .format(
                                                      DateTimeFormatter.ofPattern(
                                                              "yyyy.MM.dd HH:mm"
                                                      )
                                                  )
                                    )
                                    .build();

                    return response;
                })
                .toList();
    }
    
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews(
            Long userId
    ) {

        return reviewRepository
                .findByWriterIdOrderByIdDesc(userId)
                .stream()
                .map(review -> {

                    ReviewResponse response =
                            ReviewResponse.builder()
                                    .id(review.getId())
                                    .writerId(review.getWriterId())
                                    .writerNickname(
                                            userRepository.findById(
                                                    review.getWriterId()
                                            )
                                            .orElseThrow()
                                            .getNickname()
                                    )
                                    .commissionTitle(
                                            review.getPayment()
                                                  .getCommission()
                                                  .getTitle()
                                    )
                                    .rating(review.getRating())
                                    .content(review.getContent())
                                    .createdAt(
                                            review.getCreatedAt()
                                                  .format(
                                                          DateTimeFormatter.ofPattern(
                                                                  "yyyy.MM.dd HH:mm"
                                                          )
                                                  )
                                    )
                                    .build();

                    return response;
                })
                .toList();
    }
}