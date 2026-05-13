import { useEffect, useState } from "react";
import { getInquiries } from "../api/inquiryApi";
import InquiryItem from "./InquiryItem";

export default function InquiryList({
  commissionId,
  refresh,
  commissionUserId
}) {

  const [list, setList] = useState([]);

  const fetchData = async () => {

    try {

      const data = await getInquiries(commissionId);

      setList(data);

    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [commissionId, refresh]);

  // 부모글
  const parents = list.filter(i => !i.parentId);

  // 답글
  const replies = list.filter(i => i.parentId);

  return (
    <div>

      {parents.map(parent => (

        <div key={parent.id}>

          {/* 부모글 */}
          <InquiryItem
            item={parent}
            onRefresh={fetchData}
            commissionId={commissionId}
            commissionUserId={commissionUserId}
          />

          {/* 해당 부모의 답글 */}
          {replies
            .filter(reply => reply.parentId === parent.id)
            .map(reply => (

              <InquiryItem
                key={reply.id}
                item={reply}
                onRefresh={fetchData}
                commissionId={commissionId}
                commissionUserId={commissionUserId}
              />
            ))}

        </div>
      ))}

    </div>
  );
}