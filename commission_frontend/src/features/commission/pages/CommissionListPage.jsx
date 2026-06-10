import { useEffect, useState } from "react";
import { getCommissionList } from "../api/commissionApi.js";
import { Link } from "react-router-dom";

export default function CommissionListPage() {
  const [list, setList] = useState([]);
  console.log(list);

  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");

  const fetchList = async () => {
    try {
      const res = await getCommissionList({
        keyword,
        minPrice,
        category,
        sort
      });
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 최초 로딩
  useEffect(() => {
    fetchList();
  }, []);

  // 검색 자동 반영 (디바운싱)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchList();
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword, minPrice, category, sort]);

  return (
    <div>
      <h2>커미션 목록</h2>

      {/* 등록 버튼 */}
      <Link to="/create">등록하기</Link>

      {/* 🔍 검색 영역 */}
      <div style={{ marginTop: "20px" }}>
        <input
          placeholder="검색어"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          type="number"
          placeholder="최소 가격"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">전체</option>
          <option value="SD">SD</option>
          <option value="ILLUSTRATION">일러스트</option>
          <option value="BACKGROUND">배경</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="priceAsc">가격 낮은순</option>
          <option value="priceDesc">가격 높은순</option>
        </select>
      </div>

      {/* 📦 리스트 */}
      <div
        style={{
          marginTop: "20px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}
      >
        {list.map((c) => (
          <Link
            key={c.id}
            to={`/commission/${c.id}`}
            style={{
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#fff",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.1)",
                transition: "0.2s"
              }}
            >
              <img
                src={`http://localhost:8484${c.thumbnailUrl}`}
                onError={(e) =>
                  (e.target.src = "/default.png")
                }
                alt=""
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "cover"
                }}
              />

              <div
                style={{
                  padding: "15px"
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    marginBottom: "10px"
                  }}
                >
                  {c.title}
                </h3>

                <div>
                  ⭐ {c.avgRating?.toFixed(1) ?? 0}
                  ({c.reviewCount ?? 0})
                </div>

                <div>
                  조회수 {c.viewCount ?? 0}
                </div>

                <div
                  style={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "18px"
                  }}
                >
                  {c.price?.toLocaleString()}원
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}