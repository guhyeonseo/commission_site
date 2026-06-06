import { useEffect, useState } from "react";
import { getMyReviews } from "../api/reviewApi";

export default function MyReviewsPage() {

  const [reviews, setReviews] =
    useState([]);

  useEffect(() => {

    getMyReviews()
      .then(res => {
        setReviews(res.data);
      });

  }, []);

  return (
    <div>

      <h2>내가 작성한 리뷰</h2>

      {reviews.length === 0 ? (

        <p>작성한 리뷰가 없습니다.</p>

      ) : (

        reviews.map(review => (

          <div
            key={review.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px"
            }}
          >

            <div>
              커미션 :
              {review.commissionTitle}
            </div>

            <div>
              {"★".repeat(Math.floor(review.rating))}
              {"☆".repeat(5 - Math.floor(review.rating))}
              ({review.rating})
            </div>

            <div>
              {review.content}
            </div>

            <div>
              {review.createdAt}
            </div>

          </div>
        ))
      )}

    </div>
  );
}