import { useEffect, useState } from "react";
import { getInquiries } from "../../inquiry/api/inquiryApi";
import InquiryItem from "./InquiryItem";

export default function InquiryList({ commissionId, userId, refresh }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData();
  }, [commissionId, refresh]);

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {

    setLoading(true);
    try {
      const res = await getInquiries(commissionId);
      console.log("@# res:", res);
      console.log("@# typeof res:", typeof res);

      setList(res || []);
    } catch (e) {
      console.error(e);
      setList([]);
    } finally {
      setLoading(false);
    }
    console.log("userId:", userId);
  };

  return (
    <div>
      <h3>문의</h3>

      {loading ? (
        <div>로딩중...</div>
      ) : list.length === 0 ? (
        <div>문의 없음</div>
      ) : (
        list.map((item) => (
          <InquiryItem
            key={item.id}
            item={item}
            userId={userId}
            onRefresh={fetchData}
          />
        ))
      )}
    </div>
  );
}