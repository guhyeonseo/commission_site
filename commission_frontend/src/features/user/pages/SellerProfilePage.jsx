import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        <div>
            <h2>{seller.nickname}</h2>

            <p>{seller.introduction}</p>

            <h3>등록한 커미션</h3>

            {commissions.length === 0 ? (
                <p>등록된 커미션이 없습니다.</p>
            ) : (
                commissions.map((commission) => (
                    <div
                        key={commission.id}
                        onClick={() =>
                            navigate(`/commission/${commission.id}`)
                        }
                        style={{
                            cursor: "pointer",
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            display: "flex",
                            gap: "15px",
                            alignItems: "center"
                        }}
                    >
                        <img
                            src={`http://localhost:8484${commission.thumbnailUrl}`}
                            alt=""
                            width="150"
                        />

                        <div>
                            <h4>{commission.title}</h4>

                            <div>
                                ⭐ {commission.avgRating?.toFixed(1) ?? "0.0"}
                                ({commission.reviewCount ?? 0}개)
                            </div>

                            <div>
                                💰 {commission.price?.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}