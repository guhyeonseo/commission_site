import { FaChevronDown } from "react-icons/fa";
import useColorPicker from "../hooks/useColorPicker";

export default function ColorPicker({ editor }) {
  const {
    showColor,
    setShowColor,
    mode,
    setMode,
    recentColors,
    textColor,
    bgColor,
    colors,
    applyColor,
    setTextColor,
    setBgColor,
  } = useColorPicker(editor);

  return (
    <div className="color-group">
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
            borderRadius: "3px",
          }}
        >
          A
        </span>

        <div
          style={{
            height: "3px",
            background: textColor,
            marginTop: "2px",
          }}
        />
      </button>

      <button
        type="button"
        className="color-arrow"
        onClick={() => setShowColor((prev) => !prev)}
      >
        <FaChevronDown size={12} />
      </button>

      {showColor && (
        <div className="color-dropdown">
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

          <div className="recent-colors">
            {recentColors.map((c, i) => (
              <div
                key={i}
                className="color-box"
                style={{
                  background: c.type === "bg" ? c.color : "white",
                  border:
                    c.type === "text"
                      ? `2px solid ${c.color}`
                      : "none",
                }}
                onClick={() => {
                  if (c.type === "text") {
                    setTextColor(c.color);
                    editor.chain().focus().setColor(c.color).run();
                  } else {
                    setBgColor(c.color);
                    editor
                      .chain()
                      .focus()
                      .setHighlight({ color: c.color })
                      .run();
                  }

                  setShowColor(false);
                }}
              />
            ))}
          </div>

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
  );
}