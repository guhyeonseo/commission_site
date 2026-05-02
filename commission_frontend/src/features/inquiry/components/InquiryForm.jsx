import { useState } from "react";
import { createInquiry } from "../api/inquiryApi";

export default function InquiryForm({ commissionId, onSuccess }) {
  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const handleSubmit = async () => {

    if (!content.trim()) return;

    try {
      await createInquiry({
        commissionId,
        content,
        isSecret,
        parentId: null
      });

      setContent("");
      onSuccess();
    } catch (e) {
      console.error(e);
      alert("작성 실패");
    }
  };

  return (
    <div>
      <h4>문의 작성</h4>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
          />
          비밀글
        </label>
      </div>
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}