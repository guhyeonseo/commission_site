import { useEffect, useState } from "react";
import { getMyReviews } from "../api/reviewApi";
import styles from "./MyReviewsPage.module.css";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getMyReviews().then((res) => {
      setReviews(res.data);
    });
  }, []);

  const renderStars = (rating) => {
    return (
      "★".repeat(Math.floor(rating)) +
      "☆".repeat(5 - Math.floor(rating))
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        내가 작성한 리뷰
      </h2>

      {reviews.length === 0 ? (
        <div className={styles.empty}>
          작성한 리뷰가 없습니다.
        </div>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className={styles.card}
          >
            <div className={styles.row}>
              <span>커미션</span>
              <strong>
                {review.commissionTitle}
              </strong>
            </div>

            <div className={styles.rating}>
              {renderStars(review.rating)}
              <span className={styles.score}>
                ({review.rating})
              </span>
            </div>

            <div className={styles.content}>
              {review.content}
            </div>

            <div className={styles.date}>
              {review.createdAt}
            </div>
          </div>
        ))
      )}
    </div>
  );
}