import { useState } from "react";

export default function useColorPicker(editor) {
  const [showColor, setShowColor] = useState(false);
  const [mode, setMode] = useState("text");
  const [recentColors, setRecentColors] = useState([]);

  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState(null);

  const colors = [
    "#000000", "#3f3f3f", "#6b6b6b", "#9e9e9e", "#cfcfcf", "#eaeaea", "#ffffff",
    "#7f1d1d", "#b91c1c", "#ef4444", "#f87171", "#fca5a5", "#fee2e2", "#fff5f5",
    "#7c2d12", "#c2410c", "#f97316", "#fb923c", "#fdba74", "#ffedd5", "#fff7ed",
    "#713f12", "#ca8a04", "#facc15", "#fde047", "#fef08a", "#fef9c3", "#fffbea",
    "#14532d", "#15803d", "#22c55e", "#4ade80", "#86efac", "#dcfce7", "#f0fdf4",
    "#1e3a8a", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe", "#eff6ff",
    "#3b0764", "#6d28d9", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ede9fe", "#f5f3ff",
  ];

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

  return {
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
  };
}