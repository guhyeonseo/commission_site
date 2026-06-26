import { useState } from "react";
import { createInquiry } from "../api/inquiryApi";
import "./InquiryForm.css";

export default function InquiryForm({
  commissionId,
  parentId = null,
  onSuccess
}) {

  const [content, setContent] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const handleSubmit = async () => {

    if (!content.trim()) return;

    try {

      await createInquiry({
        commissionId,
        content,
        isSecret,
        parentId
      });

      setContent("");

      if (onSuccess) {
        onSuccess();
      }

    } catch (e) {

      console.error(e);
      alert("작성 실패");

    }
  };

  return (

    <div className="inquiry-form">

      <textarea
        className="inquiry-textarea"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="문의 내용을 입력하세요"
      />

      <div className="inquiry-bottom">

        <label className="secret-check">

          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) =>
              setIsSecret(e.target.checked)
            }
          />

          비밀글

        </label>

        <button
          className="inquiry-btn"
          onClick={handleSubmit}
        >
          등록
        </button>

      </div>

    </div>

  );
}