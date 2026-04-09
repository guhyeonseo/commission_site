import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommissionDetail } from "../features/commission/api/commissionApi.js";

export default function CommissionDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getCommissionDetail(id).then((res) => setData(res.data));
  }, [id]);

  if (!data) return <div>로딩...</div>;

  return (
    <div>
      <h2>{data.title}</h2>

      <img
        src={`http://localhost:8484${data.thumbnailUrl}`}
        width={300}
      />

      <div>
        {data.images.map((img, index) => (
          <img
            key={index}
            src={`http://localhost:8484${img.imageUrl}`}
            width={200}
          />
        ))}
      </div>
    </div>
  );
}