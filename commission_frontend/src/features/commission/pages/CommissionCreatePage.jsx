import { useRef, useState } from "react";
import { createCommission } from "../api/commissionApi.js";
import { useNavigate } from "react-router-dom";
import "./CommissionCreatePage.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import {
  FaChevronDown,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaHeading,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight
} from "react-icons/fa";
import { Extension } from "@tiptap/core";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import apiClient from "../../../services/apiClient.js"; // 경로 맞게

export default function CommissionCreatePage() {

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post("/commissions/upload", formData);

    return "http://localhost:8484" + res.data;
  };

  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    estimatedDays: "",
    category: "",
  });

  const [content, setContent] = useState("");

  const [fontSize, setFontSize] = useState(14);

  // ✅ 대표 이미지용
  const [files, setFiles] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);

  const categories = [
    { label: "만화", value: "COMIC" },
    { label: "영상", value: "VIDEO" },
    { label: "일러스트", value: "ILLUST" },
    { label: "캐릭터", value: "CHARACTER" },
    { label: "이모티콘", value: "EMOTE" },
    { label: "디자인", value: "DESIGN" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ 대표 이미지 업로드
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: crypto.randomUUID(),
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  // ✅ 대표 이미지 삭제
  const handleDelete = (index, e) => {
    e.stopPropagation();

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    if (newFiles.length === 0) {
      setThumbnailIndex(0);
    } else if (index === thumbnailIndex) {
      setThumbnailIndex(0);
    } else if (index < thumbnailIndex) {
      setThumbnailIndex((prev) => prev - 1);
    }
  };

  const [showColor, setShowColor] = useState(false);
  const [mode, setMode] = useState("text"); // text | bg
  const [tab, setTab] = useState("palette"); // palette | used
  const [recentColors, setRecentColors] = useState([]);

  const colors = [
    "#000000", "#3f3f3f", "#6b6b6b", "#9e9e9e", "#cfcfcf", "#eaeaea", "#ffffff",
    "#7f1d1d", "#b91c1c", "#ef4444", "#f87171", "#fca5a5", "#fee2e2", "#fff5f5",
    "#7c2d12", "#c2410c", "#f97316", "#fb923c", "#fdba74", "#ffedd5", "#fff7ed",
    "#713f12", "#ca8a04", "#facc15", "#fde047", "#fef08a", "#fef9c3", "#fffbea",
    "#14532d", "#15803d", "#22c55e", "#4ade80", "#86efac", "#dcfce7", "#f0fdf4",
    "#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe", "#eff6ff",
    "#3b0764", "#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ede9fe", "#f5f3ff",
  ];

  const [currentColor, setCurrentColor] = useState("#000000");

  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState(null);

  const applyColor = (color) => {
    if (mode === "text") {
      setTextColor(color);
      editor.chain().focus().setColor(color).run();
    } else {
      setBgColor(color);
      editor.chain().focus().setHighlight({ color }).run();
    }

    const newItem = { color, type: mode };

    setRecentColors((prev) => {
      const filtered = prev.filter(
        (c) => !(c.color === color && c.type === mode)
      );
      return [newItem, ...filtered].slice(0, 10);
    });

    setShowColor(false);
  };

  const FontSize = Extension.create({
    name: "fontSize",

    addOptions() {
      return {
        types: ["textStyle"],
      };
    },

    addGlobalAttributes() {
      return [
        {
          types: this.options.types,
          attributes: {
            fontSize: {
              default: null,
              parseHTML: (element) =>
                element.style.fontSize?.replace(/['"]+/g, ""),
              renderHTML: (attributes) => {
                if (!attributes.fontSize) {
                  return {};
                }
                return {
                  style: `font-size: ${attributes.fontSize}`,
                };
              },
            },
          },
        },
      ];
    },

    addCommands() {
      return {
        setFontSize:
          (fontSize) =>
            ({ chain }) => {
              return chain().setMark("textStyle", { fontSize }).run();
            },
      };
    },
  });

  // ✅ tiptap 에디터
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: `<p>내용을 입력하세요...</p>`,

    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },

    editorProps: {
      handlePaste(view, event) {
        const items = event.clipboardData?.items;

        if (!items) return false;

        for (let item of items) {
          if (item.type.startsWith("image")) {
            const file = item.getAsFile();

            uploadImage(file).then((url) => {
              editor.chain().focus().setImage({ src: url }).run();
            });

            return true;
          }
        }

        return false;
      },

      handleDrop(view, event) {
        const files = event.dataTransfer?.files;

        if (files && files[0]) {
          uploadImage(files[0]).then((url) => {
            editor.chain().focus().setImage({ src: url }).run();
          });

          return true;
        }

        return false;
      },
    },
  });

  // ✅ 에디터 이미지 업로드 (서버 없이 미리보기용)
  const handleEditorImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = async () => {
      const file = input.files[0];

      if (!file) return;

      try {
        const url = await uploadImage(file);

        console.log("업로드된 이미지:", url);

        editor.chain().focus().setImage({ src: url }).run();

      } catch (err) {
        console.error("이미지 업로드 실패", err);
        alert("이미지 업로드 실패");
      }
    };
  };

  // ✅ 제출
  const submit = async () => {
    if (!form.category || files.length === 0) {
      alert("카테고리와 대표 이미지를 확인해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", content);
    formData.append("price", Number(form.price));
    formData.append("estimatedDays", Number(form.estimatedDays));
    formData.append("category", form.category);
    formData.append("thumbnailIndex", thumbnailIndex);

    files.forEach((item) => formData.append("files", item.file));

    try {
      await createCommission(formData);
      navigate("/");
    } catch (err) {
      alert("등록 실패");
    }
  };

  return (
    <div className="create-container">
      <h2 className="create-title">커미션 등록</h2>

      <div className="create-form">

        <label>카테고리</label>
        <select className="input-category" name="category" onChange={handleChange}>
          <option value="">선택</option>
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <label>제목</label>
        <input className="input-title" name="title" onChange={handleChange} />

        <div className="thumbnail-row">
          <label>대표 이미지</label>

          <button
            className="button-thumbnail"
            onClick={() => document.getElementById("fileInput").click()}
          >
            파일 선택
          </button>
        </div>

        <input
          type="file"
          id="fileInput"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* ✅ 미리보기 */}
        <div className="preview-grid">
          {files.map((item, index) => (
            <div
              key={item.id}
              className={`preview-item ${thumbnailIndex === index ? "active" : ""}`}
              onClick={() => setThumbnailIndex(index)}
            >
              <img src={item.preview} alt="" />

              <button
                className="delete-btn"
                onClick={(e) => handleDelete(index, e)}
              >
                ✕
              </button>

              {thumbnailIndex === index && <div className="badge">대표</div>}
            </div>
          ))}
        </div>

        {/* ✅ 에디터 */}
        <label>설명</label>

        {editor && (
          <>
            <div className="toolbar">

              <input
                type="number"
                value={fontSize}
                placeholder="px"
                min="14"
                max="80"
                onChange={(e) => {
                  let size = Number(e.target.value);

                  if (!size) return;

                  // ✅ 최소값 강제
                  if (size < 14) size = 14;

                  setFontSize(size);
                  editor.chain().focus().setFontSize(size + "px").run();
                }}
                className="font-size-input"
              />

              <button
                className={editor.isActive("bold") ? "active" : ""}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <FaBold />
              </button>

              <button
                className={editor.isActive("italic") ? "active" : ""}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <FaItalic />
              </button>

              <button
                className={editor.isActive("strike") ? "active" : ""}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <FaStrikethrough />
              </button>

              <button
                className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              >
                <FaHeading />
              </button>

              <div className="color-group">

                {/* A 버튼 (바로 적용) */}
                <button
                  type="button"
                  className="color-main"
                  onClick={() => {
                    if (mode === "text") {
                      applyColor(textColor);
                    } else {
                      applyColor(bgColor || "#ffff00");
                    }
                  }}
                >
                  <span
                    style={{
                      color: textColor,
                      backgroundColor: bgColor || "transparent",
                      padding: "2px 4px",
                      borderRadius: "3px"
                    }}
                  >
                    A
                  </span>

                  <div
                    style={{
                      height: "3px",
                      background: textColor,
                      marginTop: "2px"
                    }}
                  />
                </button>

                {/* ▼ 버튼 (드롭다운) */}
                <button
                  type="button"
                  className="color-arrow"
                  onClick={() => setShowColor((prev) => !prev)}
                >
                  <FaChevronDown size={12} />
                </button>

                {showColor && (
                  <div className="color-dropdown">

                    {/* 모드 선택 */}
                    <div className="color-mode">
                      <button
                        type="button"
                        className={mode === "text" ? "active" : ""}
                        onClick={() => setMode("text")}
                      >
                        텍스트
                      </button>

                      <button
                        type="button"
                        className={mode === "bg" ? "active" : ""}
                        onClick={() => setMode("bg")}
                      >
                        배경
                      </button>
                    </div>

                    {/* 투명 */}
                    <button
                      onClick={() => {
                        if (mode === "text") {
                          editor.chain().focus().unsetColor().run();
                        } else {
                          editor.chain().focus().unsetHighlight().run();
                        }
                      }}
                    >
                      투명
                    </button>

                    {/* ✅ 여기 추가 */}
                    <div className="recent-colors">
                      {recentColors.map((c, i) => (
                        <div
                          key={i}
                          className="color-box"
                          style={{
                            background: c.type === "bg" ? c.color : "white",
                            border: c.type === "text" ? `2px solid ${c.color}` : "none"
                          }}
                          onClick={() => {
                            if (c.type === "text") {
                              setTextColor(c.color); // 🔥 추가
                              editor.chain().focus().setColor(c.color).run();
                            } else {
                              setBgColor(c.color); // 🔥 추가
                              editor.chain().focus().setHighlight({ color: c.color }).run();
                            }

                            setShowColor(false); // UX
                          }}
                        />
                      ))}
                    </div>

                    {/* 기존 팔레트 */}
                    <div className="palette">
                      {colors.map((c) => (
                        <div
                          key={c}
                          className="color-box"
                          style={{ background: c }}
                          onClick={() => applyColor(c)}
                        />
                      ))}
                    </div>

                  </div>
                )}

              </div>

              <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <FaAlignLeft />
              </button>

              <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <FaAlignCenter />
              </button>

              <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                <FaAlignRight />
              </button>

              <button
                className={editor.isActive("bulletList") ? "active" : ""}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <FaListUl />
              </button>

              <button
                className={editor.isActive("orderedList") ? "active" : ""}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <FaListOl />
              </button>

              <button onClick={handleEditorImage}>
                <FaImage />
              </button>
            </div>

            <div className="editor">
              <EditorContent editor={editor} />
            </div>
          </>
        )}

        <div className="row">
          <div className="field">
            <label>가격</label>
            <div className="input-with-unit">
              <input
                name="price"
                type="text"
                value={form.price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, price: value });
                }}
              />
              <span>원</span>
            </div>
          </div>

          <div className="field">
            <label>작업일</label>
            <div className="input-with-unit">
              <input
                name="estimatedDays"
                type="text"
                value={form.estimatedDays}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setForm({ ...form, estimatedDays: value });
                }}
              />
              <span>일</span>
            </div>
          </div>
        </div>

      </div>

      <button className="submit-btn" onClick={submit}>
        등록하기
      </button>
    </div>
  );
}