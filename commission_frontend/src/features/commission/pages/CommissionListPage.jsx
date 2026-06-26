import { useEffect, useState } from "react";
import { getCommissionList } from "../api/commissionApi.js";
import { Link } from "react-router-dom";

import "./CommissionListPage.css";

export default function CommissionListPage() {

  const [list, setList] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");

  const fetchList = async () => {

    try {

      const res =
        await getCommissionList({
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

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {

    const delay =
      setTimeout(() => {

        fetchList();

      }, 300);

    return () =>
      clearTimeout(delay);

  }, [keyword, minPrice, category, sort]);

  return (

    <div className="commissionPage">

      <div className="pageHeader">

        <h2>커미션 목록</h2>

        <Link
          to="/create"
          className="createButton"
        >
          등록하기
        </Link>

      </div>

      <div className="filterBox">

        <input
          placeholder="검색어"
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="최소 가격"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">전체</option>

          <option value="COMIC">
            만화
          </option>

          <option value="VIDEO">
            영상
          </option>

          <option value="ILLUSTRATION">
            일러스트
          </option>

          <option value="CHARACTER">
            캐릭터
          </option>

          <option value="EMOTICON">
            이모티콘
          </option>

          <option value="DESIGN">
            디자인
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="latest">
            최신순
          </option>

          <option value="priceAsc">
            가격 낮은순
          </option>

          <option value="priceDesc">
            가격 높은순
          </option>

        </select>

      </div>

      <div className="commissionGrid">

        {list.map((c) => (

          <Link
            key={c.id}
            to={`/commission/${c.id}`}
            className="commissionLink"
          >

            <div className="commissionCard">

              <img
                src={`http://localhost:8484${c.thumbnailUrl}`}
                alt=""
                className="commissionImage"
                onError={(e) =>
                  (e.target.src = "/default.png")
                }
              />

              <div className="commissionBody">

                <h3>
                  {c.title}
                </h3>

                <div className="commissionMeta">

                  별점⭐ {c.avgRating?.toFixed(1) ?? 0}
                  ({c.reviewCount ?? 0})

                </div>

                <div className="commissionMeta">

                  조회수 : {c.viewCount ?? 0}

                </div>

                <div className="commissionPrice">

                  ₩ {c.price?.toLocaleString()}

                </div>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}