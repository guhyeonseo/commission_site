import { useState } from "react";
import { createCommission } from "../features/commission/api/commissionApi.js";
import { useNavigate } from "react-router-dom";

export default function CommissionCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    estimatedDays: 0,
    category: "",
  });

  const [files, setFiles] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
  if (files.length === 0) {
    alert("이미지 파일을 업로드 해주세요.");
    return;
  }

  const formData = new FormData();

  formData.append("title", form.title);
  formData.append("description", form.description);
  formData.append("price", Number(form.price));
  formData.append("estimatedDays", Number(form.estimatedDays));
  formData.append("category", form.category);

  formData.append("thumbnailIndex", thumbnailIndex);

  files.forEach((file) => {
    formData.append("files", file);
  });

  await createCommission(formData);
  navigate("/");
};

  return (
    <div>
      <h2>커미션 등록</h2>

      <input name="title" placeholder="제목" onChange={handleChange} />
      <input name="description" placeholder="설명" onChange={handleChange} />
      <input name="price" type="number" placeholder="가격" onChange={handleChange} />
      <input name="estimatedDays" type="number" placeholder="작업일" onChange={handleChange} />
      <input name="category" placeholder="카테고리" onChange={handleChange} />

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <div>
        {files.map((file, index) => (
          <div key={index}>
            <img src={URL.createObjectURL(file)} width={100} />

            <button onClick={() => setThumbnailIndex(index)}>
              썸네일 선택
            </button>

            {thumbnailIndex === index && <p>대표 이미지</p>}
          </div>
        ))}
      </div>

      <button onClick={submit}>등록</button>
    </div>
  );
}