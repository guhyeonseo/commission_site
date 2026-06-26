import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaHeading,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";

import ColorPicker from "./ColorPicker";

export default function EditorToolbar({
  editor,
  fontSize,
  setFontSize,
  handleEditorImage,
}) {
  return (
    <div className="toolbar">
      <input
        type="number"
        value={fontSize}
        min="14"
        max="80"
        className="font-size-input"
        onChange={(e) => {
          let size = Number(e.target.value);

          if (!size) return;

          if (size < 14) size = 14;

          setFontSize(size);

          editor
            .chain()
            .focus()
            .setFontSize(size + "px")
            .run();
        }}
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
        className={
          editor.isActive("heading", { level: 1 })
            ? "active"
            : ""
        }
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <FaHeading />
      </button>

      <ColorPicker editor={editor} />

      <button
        onClick={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
      >
        <FaAlignLeft />
      </button>

      <button
        onClick={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
      >
        <FaAlignCenter />
      </button>

      <button
        onClick={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
      >
        <FaAlignRight />
      </button>

      <button
        className={
          editor.isActive("bulletList") ? "active" : ""
        }
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
      >
        <FaListUl />
      </button>

      <button
        className={
          editor.isActive("orderedList") ? "active" : ""
        }
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
      >
        <FaListOl />
      </button>

      <button onClick={handleEditorImage}>
        <FaImage />
      </button>
    </div>
  );
}