import { useEffect, useState } from "react";
import { getCommissionList } from "../api/commissionApi.js";
import SearchFilter from "@/components/common/SearchFilter/SearchFilter.jsx";
import Pagination from "@/components/common/Pagination/Pagination.jsx";
import { Link } from "react-router-dom";

import "./CommissionListPage.css";

export default function CommissionListPage() {

  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearch = (newSearch) => {
    setSearch(newSearch);
    setPage(0);
  };

  const [search, setSearch] = useState({
    keyword: "",
    minPrice: "",
    category: "",
    sort: "latest",
  });

  const fetchList = async () => {

    try {

      const res = await getCommissionList({
        ...search,
        page,
        size: 12,
      });

      console.log(res.data);

      setList(res.data.content);
      setTotalPages(res.data.totalPages);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    const delay = setTimeout(() => {
      fetchList();
    }, 300);

    return () => clearTimeout(delay);

  }, [search, page]);

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

      <SearchFilter
        search={search}
        setSearch={handleSearch}
        usePrice
        useCategory
        useSort
      />

      <div className="commissionGrid">

        {list.map((c) => (

          <Link
            key={c.id}
            to={`/commission/${c.id}`}
            className="commissionLink"
          >

            <div className="commissionCard">

              <img
                src={c.thumbnailUrl}
                alt=""
                className="commissionImage"
                onError={(e) => {
                  e.target.src = "/default.png";
                }}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

    </div>

  );

}