import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SellerProfilePage.css";
import {
    getSellerProfile,
    getSellerCommissions
} from "../api/userApi";

export default function SellerProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [seller, setSeller] = useState(null);
    const [commissions, setCommissions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sellerData = await getSellerProfile(id);
                console.log("소개글 : " + sellerData);
                console.log("sellerData =", sellerData);


                setSeller(sellerData);

                const commissionData =
                    await getSellerCommissions(id);

                console.log("커미션 목록", commissionData);

                setCommissions(commissionData);

            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [id]);

    if (!seller) {
        return <div>로딩중...</div>;
    }

    return (
        <div className="seller-profile-container">

            <h2 className="seller-name">
                {seller.nickname}
            </h2>

            <p className="seller-introduction">
                {seller.introduction}
            </p>

            <h3 className="section-title">
                등록한 커미션
            </h3>

            {commissions.length === 0 ? (
                <p className="empty-message">
                    등록된 커미션이 없습니다.
                </p>
            ) : (
                commissions.map((commission) => (
                    <div
                        key={commission.id}
                        className="commission-card"
                        onClick={() =>
                            navigate(`/commission/${commission.id}`)
                        }
                    >
                        <img
                            src={commission.thumbnailUrl}
                            alt={commission.title}
                            className="commission-thumbnail"
                        />

                        <div className="commission-info">

                            <h4 className="commission-title">
                                {commission.title}
                            </h4>

                            <div className="commission-meta">
                                ⭐ {commission.avgRating?.toFixed(1) ?? "0.0"}
                                ({commission.reviewCount ?? 0}개)
                            </div>

                            <div className="commission-price">
                                💰 {commission.price?.toLocaleString()}원
                            </div>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
}