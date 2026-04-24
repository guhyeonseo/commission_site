import { useEffect, useState } from "react";
import { getCommissionList } from "../api/commissionApi.js";
import { Link } from "react-router-dom";

export default function CommissionListPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    getCommissionList().then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h2>커미션 목록</h2>

      <Link to="/create">등록하기</Link>

      {list.map((c) => (
        <div key={c.id}>
          <Link to={`/commission/${c.id}`}>
            <img src={`http://localhost:8484${c.thumbnailUrl}`} width={200} />
            <p>{c.title}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}